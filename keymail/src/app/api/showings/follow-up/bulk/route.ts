import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
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

// POST /api/showings/follow-up/bulk - Send bulk follow-up emails
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      showingIds, 
      emailTemplate, 
      customMessage, 
      tone = "professional",
      includeFeedbackRequest = true 
    } = await request.json();

    if (!showingIds || !Array.isArray(showingIds) || showingIds.length === 0) {
      return NextResponse.json(
        { error: "Showing IDs array is required" },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    // Process each showing
    for (const showingId of showingIds) {
      try {
        const showing = await getShowingById(showingId);

        if (!showing || showing.userId !== session.user.id) {
          errors.push(`Showing ${showingId}: Not found`);
          continue;
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
          errors.push(`Showing ${showingId}: Client or listing not found`);
          continue;
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

        results.push({
          emailId: emailResult._id?.toString() || emailResult.id,
          subject: emailContent.subject,
          showingId: showing._id?.toString() || showing.id,
          clientName: clientData.name,
          listingAddress: listingData.address,
          followUpSent: true,
          feedbackRequested: includeFeedbackRequest,
        });

      } catch (error) {
        console.error(`Error processing showing ${showingId}:`, error);
        errors.push(`Showing ${showingId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalProcessed: showingIds.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors: errors.length > 0 ? errors : undefined,
      },
    });

  } catch (error) {
    console.error("Error sending bulk showing follow-ups:", error);
    return NextResponse.json(
      { error: "Failed to send bulk showing follow-ups" },
      { status: 500 }
    );
  }
}

