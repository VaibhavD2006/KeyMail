import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { showings, clients, listings, emailHistory, showingFeedback } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { generateEmailContent } from "@/lib/ai/openai";

// GET /api/showings/follow-up - Get showings that need follow-up emails
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const daysAgo = parseInt(searchParams.get("daysAgo") || "1");

    // Get showings completed in the last X days that haven't had follow-up emails sent
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    const showingsNeedingFollowUp = await db
      .select()
      .from(showings)
      .where(and(
        eq(showings.userId, session.user.id),
        eq(showings.status, "completed"),
        eq(showings.followUpSent, false),
        isNull(showings.completedAt) // This will be updated to use proper date comparison
      ))
      .orderBy(desc(showings.completedAt));

    // Enrich with client and listing details
    const enrichedShowings = await Promise.all(
      showingsNeedingFollowUp.map(async (showing) => {
        const [client, listing] = await Promise.all([
          db.select().from(clients).where(eq(clients.id, showing.clientId)).limit(1),
          db.select().from(listings).where(eq(listings.id, showing.listingId)).limit(1),
        ]);

        return {
          ...showing,
          client: client[0] || null,
          listing: listing[0] || null,
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
      return NextResponse.json(
        { error: "Showing not found" },
        { status: 404 }
      );
    }

    const showing = showingResult[0];

    // Get client and listing details
    const [client, listing] = await Promise.all([
      db.select().from(clients).where(eq(clients.id, showing.clientId)).limit(1),
      db.select().from(listings).where(eq(listings.id, showing.listingId)).limit(1),
    ]);

    if (client.length === 0 || listing.length === 0) {
      return NextResponse.json(
        { error: "Client or listing not found" },
        { status: 404 }
      );
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

    return NextResponse.json({
      success: true,
      data: {
        emailId: emailResult[0].id,
        subject: emailContent.subject,
        showingId: showing.id,
        clientName: client[0].name,
        listingAddress: listing[0].address,
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


