import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { milestones } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * GET /api/milestones/[id] - Get a specific milestone
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const milestoneId = params.id;

    const result = await db
      .select()
      .from(milestones)
      .where(
        and(
          eq(milestones.id, milestoneId),
          eq(milestones.userId, userId)
        )
      )
      .limit(1);

    if (!result[0]) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0]
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
 * PUT /api/milestones/[id] - Update a milestone
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const milestoneId = params.id;
    const body = await req.json();

    // Calculate next send date if date is being updated
    let updateData = { ...body, updatedAt: new Date() };
    
    if (body.date) {
      let nextSendDate = new Date(body.date);
      
      if (body.type === "home_anniversary" || body.type === "closing") {
        nextSendDate.setFullYear(nextSendDate.getFullYear() + 1);
      } else if (body.type === "birthday") {
        const today = new Date();
        const birthday = new Date(body.date);
        birthday.setFullYear(today.getFullYear());
        
        if (birthday < today) {
          birthday.setFullYear(today.getFullYear() + 1);
        }
        nextSendDate = birthday;
      }
      
      updateData.nextSendDate = nextSendDate;
    }

    const result = await db
      .update(milestones)
      .set(updateData)
      .where(
        and(
          eq(milestones.id, milestoneId),
          eq(milestones.userId, userId)
        )
      )
      .returning();

    if (!result[0]) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Milestone updated successfully"
    });
  } catch (error) {
    console.error("Error in PUT /api/milestones/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update milestone" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/milestones/[id] - Delete a milestone
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const milestoneId = params.id;

    const result = await db
      .delete(milestones)
      .where(
        and(
          eq(milestones.id, milestoneId),
          eq(milestones.userId, userId)
        )
      )
      .returning();

    if (!result[0]) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }

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

