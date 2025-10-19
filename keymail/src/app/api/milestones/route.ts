import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  saveMilestone, 
  getMilestonesByUserId, 
  getUpcomingMilestones 
} from "@/lib/db/queries-mongodb";

/**
 * GET /api/milestones - Get milestones for the current user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const upcoming = searchParams.get("upcoming");
    const days = parseInt(searchParams.get("days") || "30");

    let milestones;
    if (upcoming === "true") {
      milestones = await getUpcomingMilestones(userId, days);
    } else {
      milestones = await getMilestonesByUserId(userId);
    }

    return NextResponse.json({ 
      success: true, 
      data: milestones 
    });
  } catch (error) {
    console.error("Error in GET /api/milestones:", error);
    return NextResponse.json(
      { error: "Failed to retrieve milestones" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/milestones - Create a new milestone
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    // Validate required fields
    if (!body.clientId || !body.type || !body.title || !body.date) {
      return NextResponse.json(
        { error: "Missing required fields: clientId, type, title, date" },
        { status: 400 }
      );
    }

    // Calculate next send date based on milestone type
    let nextSendDate = new Date(body.date);
    
    if (body.type === "home_anniversary" || body.type === "closing") {
      // For anniversaries, set next year
      nextSendDate.setFullYear(nextSendDate.getFullYear() + 1);
    } else if (body.type === "birthday") {
      // For birthdays, set next year
      const today = new Date();
      const birthday = new Date(body.date);
      birthday.setFullYear(today.getFullYear());
      
      if (birthday < today) {
        birthday.setFullYear(today.getFullYear() + 1);
      }
      nextSendDate = birthday;
    }

    const milestoneData = {
      userId,
      clientId: body.clientId,
      type: body.type,
      title: body.title,
      date: new Date(body.date),
      message: body.message,
      nextSendDate,
      isActive: body.isActive !== false,
      emailTemplateId: body.emailTemplateId,
    };

    const milestone = await saveMilestone(milestoneData);

    return NextResponse.json({
      success: true,
      data: milestone,
      message: "Milestone created successfully"
    });
  } catch (error) {
    console.error("Error in POST /api/milestones:", error);
    return NextResponse.json(
      { error: "Failed to create milestone" },
      { status: 500 }
    );
  }
}

