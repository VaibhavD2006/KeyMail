import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { showings, clients, listings, emailHistory } from "@/lib/db/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { generateEmailContent } from "@/lib/ai/openai";

// GET /api/showings - Get all showings for a user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const listingId = searchParams.get("listingId");
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    let query = db
      .select()
      .from(showings)
      .where(eq(showings.userId, session.user.id));

    if (clientId) {
      query = query.where(eq(showings.clientId, clientId));
    }

    if (listingId) {
      query = query.where(eq(showings.listingId, listingId));
    }

    if (status) {
      query = query.where(eq(showings.status, status));
    }

    if (dateFrom) {
      query = query.where(gte(showings.scheduledAt, new Date(dateFrom)));
    }

    if (dateTo) {
      query = query.where(lte(showings.scheduledAt, new Date(dateTo)));
    }

    query = query.orderBy(desc(showings.scheduledAt));

    const showingsResult = await query;

    // Enrich with client and listing details
    const enrichedShowings = await Promise.all(
      showingsResult.map(async (showing) => {
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
      data: enrichedShowings,
    });
  } catch (error) {
    console.error("Error fetching showings:", error);
    return NextResponse.json(
      { error: "Failed to fetch showings" },
      { status: 500 }
    );
  }
}

// POST /api/showings - Create a new showing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      clientId, 
      listingId, 
      scheduledAt, 
      agentNotes, 
      status = "scheduled" 
    } = await request.json();

    if (!clientId || !listingId || !scheduledAt) {
      return NextResponse.json(
        { error: "Client ID, listing ID, and scheduled date are required" },
        { status: 400 }
      );
    }

    // Verify client and listing belong to user
    const [clientResult, listingResult] = await Promise.all([
      db.select().from(clients).where(
        and(eq(clients.id, clientId), eq(clients.userId, session.user.id))
      ).limit(1),
      db.select().from(listings).where(
        and(eq(listings.id, listingId), eq(listings.userId, session.user.id))
      ).limit(1),
    ]);

    if (clientResult.length === 0) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    if (listingResult.length === 0) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Create showing
    const showingData = {
      userId: session.user.id,
      clientId,
      listingId,
      scheduledAt: new Date(scheduledAt),
      agentNotes,
      status,
      followUpSent: false,
    };

    const result = await db
      .insert(showings)
      .values(showingData)
      .returning();

    // Enrich with client and listing details
    const enrichedShowing = {
      ...result[0],
      client: clientResult[0],
      listing: listingResult[0],
    };

    return NextResponse.json({
      success: true,
      data: enrichedShowing,
    });
  } catch (error) {
    console.error("Error creating showing:", error);
    return NextResponse.json(
      { error: "Failed to create showing" },
      { status: 500 }
    );
  }
}

// PUT /api/showings - Update showing status and notes
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      showingId, 
      status, 
      agentNotes, 
      completedAt,
      followUpSent = false 
    } = await request.json();

    if (!showingId) {
      return NextResponse.json(
        { error: "Showing ID is required" },
        { status: 400 }
      );
    }

    // Get existing showing
    const existingShowing = await db
      .select()
      .from(showings)
      .where(and(
        eq(showings.id, showingId),
        eq(showings.userId, session.user.id)
      ))
      .limit(1);

    if (existingShowing.length === 0) {
      return NextResponse.json(
        { error: "Showing not found" },
        { status: 404 }
      );
    }

    // Update showing
    const updateData: any = {};
    if (status) updateData.status = status;
    if (agentNotes !== undefined) updateData.agentNotes = agentNotes;
    if (completedAt) updateData.completedAt = new Date(completedAt);
    if (followUpSent !== undefined) updateData.followUpSent = followUpSent;

    const result = await db
      .update(showings)
      .set(updateData)
      .where(eq(showings.id, showingId))
      .returning();

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Error updating showing:", error);
    return NextResponse.json(
      { error: "Failed to update showing" },
      { status: 500 }
    );
  }
}

