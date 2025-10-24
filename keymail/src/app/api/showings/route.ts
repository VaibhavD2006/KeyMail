import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  getShowingsByUserId, 
  saveShowing, 
  getShowingById, 
  updateShowing,
  getClientById,
  getListingById
} from "@/lib/db/queries-mongodb";
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

    const filters: any = {};
    if (clientId) filters.clientId = clientId;
    if (listingId) filters.listingId = listingId;
    if (status) filters.status = status;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    const showingsResult = await getShowingsByUserId(session.user.id, filters);

    // Enrich with client and listing details
    const enrichedShowings = await Promise.all(
      showingsResult.map(async (showing: any) => {
        const [client, listing] = await Promise.all([
          getClientById(showing.clientId),
          getListingById(showing.listingId),
        ]);

        return {
          ...showing.toObject(),
          client: client ? client.toObject() : null,
          listing: listing ? listing.toObject() : null,
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
    const [client, listing] = await Promise.all([
      getClientById(clientId),
      getListingById(listingId),
    ]);

    if (!client || client.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    if (!listing || listing.userId !== session.user.id) {
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

    const result = await saveShowing(showingData);

    // Enrich with client and listing details
    const enrichedShowing = {
      ...result.toObject(),
      client: client.toObject(),
      listing: listing.toObject(),
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
    const existingShowing = await getShowingById(showingId);

    if (!existingShowing || existingShowing.userId !== session.user.id) {
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

    const result = await updateShowing(showingId, updateData);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error updating showing:", error);
    return NextResponse.json(
      { error: "Failed to update showing" },
      { status: 500 }
    );
  }
}
