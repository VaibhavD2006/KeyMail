import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getShowingsNeedingFollowUp,
  getShowingById,
  getClientById,
  getListingById,
  saveEmailHistory,
  markShowingFollowUpSent,
} from "@/lib/db/queries-mongodb";
import { generateEmailContent } from "@/lib/ai/openai";

function toPlainObject(document: any) {
  return document?.toObject ? document.toObject() : document;
}

function buildShowingContext(
  listing: any,
  showing: any,
  customMessage?: string,
  includeFeedbackRequest?: boolean
) {
  return [
    `Property: ${listing.address || "Unknown address"}, ${listing.city || ""} ${listing.state || ""} ${listing.zipCode || ""}`.trim(),
    listing.price ? `Price: $${listing.price.toLocaleString()}` : null,
    listing.mlsId ? `MLS ID: ${listing.mlsId}` : null,
    showing.scheduledAt ? `Scheduled showing: ${new Date(showing.scheduledAt).toLocaleString()}` : null,
    showing.completedAt ? `Completed showing: ${new Date(showing.completedAt).toLocaleString()}` : null,
    showing.agentNotes ? `Agent notes: ${showing.agentNotes}` : null,
    customMessage ? `Custom message: ${customMessage}` : null,
    includeFeedbackRequest ? "Include a concise request for feedback about the showing." : null,
  ]
    .filter(Boolean)
    .join("\n");
}

// GET /api/showings/follow-up - Get showings that need follow-up emails
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const daysAgo = parseInt(searchParams.get("daysAgo") || "1");

    // Get recently completed showings that haven't had follow-up emails sent.
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    const showingsNeedingFollowUp = await getShowingsNeedingFollowUp(session.user.id, daysAgo);

    // Enrich with client and listing details
    const enrichedShowings = await Promise.all(
      showingsNeedingFollowUp.map(async (showing: any) => {
        const [client, listing] = await Promise.all([
          getClientById(showing.clientId),
          getListingById(showing.listingId),
        ]);

        return {
          ...toPlainObject(showing),
          client: client ? toPlainObject(client) : null,
          listing: listing ? toPlainObject(listing) : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        showings: enrichedShowings,
        totalNeedingFollowUp: enrichedShowings.length,
        cutoffDate: cutoffDate.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching showings needing follow-up:", error);
    return NextResponse.json(
      { error: "Failed to fetch showings needing follow-up" },
      { status: 500 }
    );
  }
}

// POST /api/showings/follow-up - Send follow-up email for a specific showing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      showingId, 
      emailTemplate, 
      customMessage, 
      tone = "professional",
      includeFeedbackRequest = true 
    } = await request.json();

    if (!showingId) {
      return NextResponse.json(
        { error: "Showing ID is required" },
        { status: 400 }
      );
    }

    const showing = await getShowingById(showingId);

    if (!showing || showing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Showing not found" },
        { status: 404 }
      );
    }

    // Get client and listing details
    const [client, listing] = await Promise.all([
      getClientById(showing.clientId),
      getListingById(showing.listingId),
    ]);

    if (
      !client ||
      !listing ||
      client.userId !== session.user.id ||
      listing.userId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Client or listing not found" },
        { status: 404 }
      );
    }

    const clientData = toPlainObject(client);
    const listingData = toPlainObject(listing);
    const showingData = toPlainObject(showing);

    // Generate follow-up email content
    const emailContent = await generateEmailContent({
      client: {
        name: clientData.name,
        email: clientData.email,
        relationship: clientData.relationshipLevel,
        tags: clientData.tags,
      },
      occasion: "showing_follow_up",
      tone,
      additionalContext: buildShowingContext(
        listingData,
        showingData,
        customMessage || emailTemplate,
        includeFeedbackRequest
      ),
    });

    // Save email to history
    const emailResult = await saveEmailHistory({
      userId: session.user.id,
      clientId: showing.clientId,
      occasion: "showing_follow_up",
      subject: emailContent.subject,
      generatedContent: emailContent.content,
      editedContent: emailContent.content,
      status: "sent",
      sentDate: new Date(),
      metadata: {
        aiParameters: {
          tone,
          style: "professional",
          length: "medium",
        },
      },
    });

    // Update showing to mark follow-up as sent
    const updatedShowing = await markShowingFollowUpSent(showingId, session.user.id);
    if (!updatedShowing) {
      throw new Error("Showing disappeared before follow-up could be marked sent");
    }

    return NextResponse.json({
      success: true,
      data: {
        emailId: emailResult._id?.toString() || emailResult.id,
        subject: emailContent.subject,
        showingId: showing._id?.toString() || showing.id,
        clientName: clientData.name,
        listingAddress: listingData.address,
        followUpSent: true,
        feedbackRequested: includeFeedbackRequest,
      },
    });

  } catch (error) {
    console.error("Error sending showing follow-up:", error);
    return NextResponse.json(
      { error: "Failed to send showing follow-up" },
      { status: 500 }
    );
  }
}


