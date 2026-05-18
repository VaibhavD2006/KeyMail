import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getClientsByUserId,
  getListingsByUserId,
  getPropertyMatchesByUserId,
  updatePropertyMatch,
  saveEmailHistory,
} from "@/lib/db/queries-mongodb";
import { generateEmailContent } from "@/lib/ai/openai";

// POST /api/matches/send-bulk - Send bulk emails for property matches
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clientIds, listingIds, emailTemplate, customMessage, tone = "professional" } = await request.json();

    if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
      return NextResponse.json(
        { error: "Client IDs array is required" },
        { status: 400 }
      );
    }

    if (!listingIds || !Array.isArray(listingIds) || listingIds.length === 0) {
      return NextResponse.json(
        { error: "Listing IDs array is required" },
        { status: 400 }
      );
    }

    // Get all clients and listings
    const [allClients, allListings] = await Promise.all([
      getClientsByUserId(session.user.id),
      getListingsByUserId(session.user.id),
    ]);

    // Filter to only requested clients and listings
    const clientsResult = allClients.filter((c: any) => 
      clientIds.includes(c._id.toString())
    );
    const listingsResult = allListings.filter((l: any) => 
      listingIds.includes(l._id.toString())
    );

    if (clientsResult.length === 0) {
      return NextResponse.json(
        { error: "No clients found" },
        { status: 404 }
      );
    }

    if (listingsResult.length === 0) {
      return NextResponse.json(
        { error: "No listings found" },
        { status: 404 }
      );
    }

    // Get existing property matches
    const allMatches = await getPropertyMatchesByUserId(session.user.id);
    
    // Create a map for quick lookup
    const matchMap = new Map();
    allMatches.forEach((match: any) => {
      const key = `${match.clientId}-${match.listingId}`;
      matchMap.set(key, match);
    });

    const results = [];
    const errors = [];

    // Process each client-listing combination
    for (const client of clientsResult) {
      for (const listing of listingsResult) {
        try {
          const matchKey = `${client._id.toString()}-${listing._id.toString()}`;
          const existingMatch = matchMap.get(matchKey);

          if (!existingMatch) {
            errors.push(`No match found for client ${client.name} and listing ${listing.mlsId}`);
            continue;
          }

          // Generate personalized email content
          const emailContent = await generateEmailContent({
            client: {
              id: client._id.toString(),
              name: client.name,
              email: client.email,
              relationshipLevel: client.relationshipLevel,
              yearsKnown: client.yearsKnown,
              tags: client.tags,
            },
            occasion: "property_match",
            tone,
            style: "real_estate",
            length: "medium",
            additionalContext: [
              "Write a personalized email recommending a matched property.",
              `Property: MLS #${listing.mlsId || "N/A"} - ${listing.address}, ${listing.city}, ${listing.state} ${listing.zipCode}`,
              listing.price ? `Price: $${Number(listing.price).toLocaleString()}` : null,
              `Property details: ${[
                listing.bedrooms ? `${listing.bedrooms} bedrooms` : null,
                listing.bathrooms ? `${listing.bathrooms} bathrooms` : null,
                listing.squareFeet ? `${Number(listing.squareFeet).toLocaleString()} sq ft` : null,
                listing.propertyType ? String(listing.propertyType).replace("_", " ") : null,
                listing.neighborhood ? `in ${listing.neighborhood}` : null,
              ].filter(Boolean).join(", ") || "No additional property details provided"}`,
              listing.features?.length ? `Features: ${listing.features.join(", ")}` : null,
              listing.description ? `Description: ${listing.description}` : null,
              `Match score: ${existingMatch.matchScore}`,
              existingMatch.reasons?.length ? `Match reasons: ${existingMatch.reasons.join(", ")}` : null,
              customMessage ? `Agent custom message: ${customMessage}` : null,
              emailTemplate ? `Requested template or theme: ${emailTemplate}` : null,
            ]
              .filter(Boolean)
              .join("\n"),
          });

          // Save email to history
          const emailRecord = await saveEmailHistory({
            userId: session.user.id,
            clientId: client._id.toString(),
            subject: emailContent.subject,
            content: emailContent.content,
            status: "sent",
            metadata: {
              milestoneType: "property_match",
              listingId: listing._id.toString(),
              matchScore: existingMatch.matchScore,
              matchReasons: existingMatch.reasons,
              tone,
              customMessage,
            },
          });

          // Update the match to mark email as sent
          await updatePropertyMatch(existingMatch._id.toString(), {
            sentEmailId: emailRecord._id.toString(),
          });

          results.push({
            clientId: client._id.toString(),
            clientName: client.name,
            listingId: listing._id.toString(),
            mlsId: listing.mlsId,
            emailId: emailRecord._id.toString(),
            subject: emailContent.subject,
            matchScore: existingMatch.matchScore,
            status: "sent",
          });

        } catch (error) {
          console.error(`Error processing client ${client.name} and listing ${listing.mlsId}:`, error);
          errors.push(`Failed to process ${client.name} - ${listing.mlsId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalProcessed: results.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors: errors.length > 0 ? errors : undefined,
      },
    });

  } catch (error) {
    console.error("Error sending bulk property match emails:", error);
    return NextResponse.json(
      { error: "Failed to send bulk emails" },
      { status: 500 }
    );
  }
}

// GET /api/matches/send-bulk - Get available clients and listings for bulk sending
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    // Get clients with property preferences
    let clientsResult = await getClientsByUserId(session.user.id);

    if (clientId) {
      clientsResult = clientsResult.filter((c: any) => c._id.toString() === clientId);
    }

    // Get active listings
    const listingsResult = await getListingsByUserId(session.user.id);

    // Get existing property matches
    const matchesResult = await getPropertyMatchesByUserId(session.user.id, 
      clientId ? { clientId } : {}
    );

    // Group matches by client
    const matchesByClient = new Map();
    matchesResult.forEach((match: any) => {
      const clientIdStr = match.clientId.toString();
      if (!matchesByClient.has(clientIdStr)) {
        matchesByClient.set(clientIdStr, []);
      }
      matchesByClient.get(clientIdStr).push(match);
    });

    // Enrich clients with their matches
    const enrichedClients = clientsResult.map((client: any) => {
      const clientIdStr = client._id.toString();
      const matches = matchesByClient.get(clientIdStr) || [];
      const activeMatches = matches.filter((match: any) => match.isActive);
      
      return {
        ...client.toObject(),
        totalMatches: matches.length,
        activeMatches: activeMatches.length,
        bestMatchScore: activeMatches.length > 0 
          ? Math.max(...activeMatches.map((m: any) => m.matchScore))
          : 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        clients: enrichedClients,
        listings: listingsResult.map((l: any) => l.toObject()),
        totalMatches: matchesResult.length,
        activeMatches: matchesResult.filter((m: any) => m.isActive).length,
      },
    });

  } catch (error) {
    console.error("Error fetching bulk email data:", error);
    return NextResponse.json(
      { error: "Failed to fetch bulk email data" },
      { status: 500 }
    );
  }
}
