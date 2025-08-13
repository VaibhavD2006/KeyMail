import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { clients, listings, propertyMatches, emailHistory } from "@/lib/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";
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
    const [clientsResult, listingsResult] = await Promise.all([
      db.select().from(clients).where(
        and(
          eq(clients.userId, session.user.id),
          inArray(clients.id, clientIds)
        )
      ),
      db.select().from(listings).where(
        and(
          eq(listings.userId, session.user.id),
          inArray(listings.id, listingIds)
        )
      )
    ]);

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

    // Get existing property matches for these client-listing combinations
    const existingMatches = await db
      .select()
      .from(propertyMatches)
      .where(
        and(
          eq(propertyMatches.userId, session.user.id),
          inArray(propertyMatches.clientId, clientIds),
          inArray(propertyMatches.listingId, listingIds)
        )
      );

    // Create a map for quick lookup
    const matchMap = new Map();
    existingMatches.forEach(match => {
      const key = `${match.clientId}-${match.listingId}`;
      matchMap.set(key, match);
    });

    const results = [];
    const errors = [];

    // Process each client-listing combination
    for (const client of clientsResult) {
      for (const listing of listingsResult) {
        try {
          const matchKey = `${client.id}-${listing.id}`;
          const existingMatch = matchMap.get(matchKey);

          if (!existingMatch) {
            errors.push(`No match found for client ${client.name} and listing ${listing.mlsId}`);
            continue;
          }

          // Generate personalized email content
          const emailContent = await generateEmailContent({
            clientName: client.name,
            clientEmail: client.email,
            occasion: "property_match",
            propertyDetails: {
              mlsId: listing.mlsId,
              address: listing.address,
              city: listing.city,
              state: listing.state,
              zipCode: listing.zipCode,
              price: listing.price,
              bedrooms: listing.bedrooms,
              bathrooms: listing.bathrooms,
              squareFeet: listing.squareFeet,
              propertyType: listing.propertyType,
              neighborhood: listing.neighborhood,
              features: listing.features,
              description: listing.description,
            },
            matchScore: existingMatch.matchScore,
            matchReasons: existingMatch.reasons,
            customMessage,
            tone,
            emailTemplate,
          });

          // Save email to history
          const emailResult = await db
            .insert(emailHistory)
            .values({
              userId: session.user.id,
              clientId: client.id,
              subject: emailContent.subject,
              content: emailContent.content,
              status: "sent",
              metadata: {
                milestoneType: "property_match",
                listingId: listing.id,
                matchScore: existingMatch.matchScore,
                matchReasons: existingMatch.reasons,
                tone,
                customMessage,
              },
            })
            .returning();

          // Update the match to mark email as sent
          await db
            .update(propertyMatches)
            .set({
              sentEmailId: emailResult[0].id,
            })
            .where(eq(propertyMatches.id, existingMatch.id));

          results.push({
            clientId: client.id,
            clientName: client.name,
            listingId: listing.id,
            mlsId: listing.mlsId,
            emailId: emailResult[0].id,
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
    let clientsQuery = db
      .select()
      .from(clients)
      .where(eq(clients.userId, session.user.id));

    if (clientId) {
      clientsQuery = clientsQuery.where(eq(clients.id, clientId));
    }

    const clientsResult = await clientsQuery;

    // Get active listings
    const listingsResult = await db
      .select()
      .from(listings)
      .where(eq(listings.userId, session.user.id));

    // Get existing property matches
    const matchesQuery = db
      .select()
      .from(propertyMatches)
      .where(eq(propertyMatches.userId, session.user.id));

    if (clientId) {
      matchesQuery.where(eq(propertyMatches.clientId, clientId));
    }

    const matchesResult = await matchesQuery;

    // Group matches by client
    const matchesByClient = new Map();
    matchesResult.forEach(match => {
      if (!matchesByClient.has(match.clientId)) {
        matchesByClient.set(match.clientId, []);
      }
      matchesByClient.get(match.clientId).push(match);
    });

    // Enrich clients with their matches
    const enrichedClients = clientsResult.map(client => {
      const matches = matchesByClient.get(client.id) || [];
      const activeMatches = matches.filter(match => match.isActive);
      
      return {
        ...client,
        totalMatches: matches.length,
        activeMatches: activeMatches.length,
        bestMatchScore: activeMatches.length > 0 
          ? Math.max(...activeMatches.map(m => m.matchScore))
          : 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        clients: enrichedClients,
        listings: listingsResult,
        totalMatches: matchesResult.length,
        activeMatches: matchesResult.filter(m => m.isActive).length,
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
