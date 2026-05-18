import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendShowingFollowUp } from "@/lib/showing-follow-up";

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
        const result = await sendShowingFollowUp({
          userId: session.user.id,
          showingId,
          emailTemplate,
          customMessage,
          tone,
          includeFeedbackRequest,
        });

        if ("error" in result) {
          errors.push(`Showing ${showingId}: ${result.error}`);
          continue;
        }

        results.push(result.data);

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

