import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  getMilestoneById, 
  updateMilestone, 
  deleteMilestone 
} from "@/lib/db/queries-mongodb";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/milestones/[id] - Get a specific milestone
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const milestone = await getMilestoneById(params.id);

    if (!milestone) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }

    // Verify the milestone belongs to the user
    if (milestone.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ 
      success: true, 
      data: milestone 
    });
  } catch (error) {
    console.error("Error in GET /api/milestones/[id]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve milestone" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/milestones/[id] - Update a milestone
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Get the milestone to verify ownership
    const existingMilestone = await getMilestoneById(params.id);
    
    if (!existingMilestone) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }

    // Verify the milestone belongs to the user
    if (existingMilestone.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.message !== undefined) updateData.message = body.message;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.nextSendDate !== undefined) updateData.nextSendDate = new Date(body.nextSendDate);
    if (body.emailTemplateId !== undefined) updateData.emailTemplateId = body.emailTemplateId;

    const milestone = await updateMilestone(params.id, updateData);

    return NextResponse.json({
      success: true,
      data: milestone,
      message: "Milestone updated successfully"
    });
  } catch (error) {
    console.error("Error in PATCH /api/milestones/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update milestone" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/milestones/[id] - Delete a milestone
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the milestone to verify ownership
    const existingMilestone = await getMilestoneById(params.id);
    
    if (!existingMilestone) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }

    // Verify the milestone belongs to the user
    if (existingMilestone.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await deleteMilestone(params.id);

    return NextResponse.json({
      success: true,
      message: "Milestone deleted successfully"
    });
  } catch (error) {
    console.error("Error in DELETE /api/milestones/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete milestone" },
      { status: 500 }
    );
  }
}
