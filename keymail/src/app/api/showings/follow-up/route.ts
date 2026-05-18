import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getClientById,
  getListingById,
  getShowingsNeedingFollowUp,
} from "@/lib/db/queries-mongodb";
import { sendShowingFollowUp } from "@/lib/showing-follow-up";

// GET /api/showings/follow-up - Get showings that need follow-up emails
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const daysAgo = parseInt(searchParams.get("daysAgo") || "1");

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    const showingsNeedingFollowUp = await getShowingsNeedingFollowUp(
      session.user.id,
      daysAgo
    );

    // Enrich with client and listing details
    const enrichedShowings = await Promise.all(
      showingsNeedingFollowUp.map(async (showing: any) => {
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

    const result = await sendShowingFollowUp({
      userId: session.user.id,
      showingId,
      emailTemplate,
      customMessage,
      tone,
      includeFeedbackRequest,
    });

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });

  } catch (error) {
    console.error("Error sending showing follow-up:", error);
    return NextResponse.json(
      { error: "Failed to send showing follow-up" },
      { status: 500 }
    );
  }
}


