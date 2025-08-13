import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { showings, clients, listings, emailHistory, showingFeedback } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { generateEmailContent } from "@/lib/ai/openai";

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
        // Get showing with client and listing details
        const showingResult = await db
          .select()
          .from(showings)
          .where(and(
            eq(showings.id, showingId),
            eq(showings.userId, session.user.id)
          ))
          .limit(1);

        if (showingResult.length === 0) {
          errors.push(`Showing ${showingId}: Not found`);
          continue;
        }

        const showing = showingResult[0];

        // Get client and listing details
        const [client, listing] = await Promise.all([
          db.select().from(clients).where(eq(clients.id, showing.clientId)).limit(1),
          db.select().from(listings).where(eq(listings.id, showing.listingId)).limit(1),
        ]);

        if (client.length === 0 || listing.length === 0) {
          errors.push(`Showing ${showingId}: Client or listing not found`);
          continue;
        }

        // Generate follow-up email content
        const emailContent = await generateEmailContent({
          clientName: client[0].name,
          clientEmail: client[0].email,
          occasion: "showing_follow_up",
          propertyDetails: {
            mlsId: listing[0].mlsId,
            address: listing[0].address,
            city: listing[0].city,
            state: listing[0].state,
            zipCode: listing[0].zipCode,
            price: listing[0].price,
            bedrooms: listing[0].bedrooms,
            bathrooms: listing[0].bathrooms,
            squareFeet: listing[0].squareFeet,
            propertyType: listing[0].propertyType,
            neighborhood: listing[0].neighborhood,
            features: listing[0].features,
            description: listing[0].description,
          },
          showingDetails: {
            scheduledAt: showing.scheduledAt,
            completedAt: showing.completedAt,
            agentNotes: showing.agentNotes,
            status: showing.status,
          },
          customMessage,
          tone,
          emailTemplate,
          includeFeedbackRequest,
        });

        // Save email to history
        const emailResult = await db
          .insert(emailHistory)
          .values({
            userId: session.user.id,
            clientId: showing.clientId,
            subject: emailContent.subject,
            content: emailContent.content,
            status: "sent",
            metadata: {
              milestoneType: "showing_follow_up",
              listingId: showing.listingId,
              showingId: showing.id,
              tone,
              customMessage,
              includeFeedbackRequest,
            },
          })
          .returning();

        // Update showing to mark follow-up as sent
        await db
          .update(showings)
          .set({
            followUpSent: true,
            followUpSentAt: new Date(),
          })
          .where(eq(showings.id, showingId));

        // Create feedback request if requested
        if (includeFeedbackRequest) {
          await db
            .insert(showingFeedback)
            .values({
              showingId: showing.id,
              clientId: showing.clientId,
              rating: null,
              liked: null,
              comments: null,
              followUpNeeded: false,
              nextAction: null,
            });
        }

        results.push({
          emailId: emailResult[0].id,
          subject: emailContent.subject,
          showingId: showing.id,
          clientName: client[0].name,
          listingAddress: listing[0].address,
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

