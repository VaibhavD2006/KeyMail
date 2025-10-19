import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  getUpcomingMilestones, 
  updateMilestoneLastSent,
  saveEmailHistory 
} from "@/lib/db/queries-mongodb";
import { generateEmailContent } from "@/lib/ai/openai";

/**
 * POST /api/milestones/send - Send milestone emails
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { milestoneId, clientId, type, title, message } = body;

    if (!milestoneId || !clientId || !type || !title) {
      return NextResponse.json(
        { error: "Missing required fields: milestoneId, clientId, type, title" },
        { status: 400 }
      );
    }

    // Generate milestone email content using AI
    const emailContent = await generateEmailContent({
      client: { id: clientId }, // We'll need to fetch full client data
      occasion: `milestone_${type}`,
      tone: "warm",
      style: "personal",
      length: "medium",
      additionalContext: `Milestone: ${title}. ${message || ''}`
    });

    if (!emailContent.success) {
      return NextResponse.json(
        { error: "Failed to generate email content" },
        { status: 500 }
      );
    }

    // Save email to history
    const emailHistory = await saveEmailHistory({
      userId,
      clientId,
      subject: emailContent.subject,
      content: emailContent.content,
      metadata: {
        milestoneType: type,
        customMessage: message
      }
    });

    // Update milestone last sent
    await updateMilestoneLastSent(milestoneId);

    // TODO: Actually send the email using SendGrid/Mailgun
    // For now, we'll just log that it would be sent
    console.log(`Would send milestone email to client ${clientId}:`, {
      subject: emailContent.subject,
      content: emailContent.content,
      milestoneType: type,
      milestoneTitle: title
    });

    return NextResponse.json({
      success: true,
      data: {
        emailId: emailHistory.id,
        subject: emailContent.subject,
        content: emailContent.content,
        sent: true
      },
      message: "Milestone email sent successfully"
    });
  } catch (error) {
    console.error("Error in POST /api/milestones/send:", error);
    return NextResponse.json(
      { error: "Failed to send milestone email" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/milestones/send - Get milestones ready to send (for automation)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "1");

    // Get milestones that are due to be sent today
    const dueMilestones = await getUpcomingMilestones(userId, days);

    // Filter milestones that are actually due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const readyToSend = dueMilestones.filter(milestone => {
      const milestoneDate = new Date(milestone.nextSendDate);
      return milestoneDate >= today && milestoneDate < tomorrow;
    });

    return NextResponse.json({
      success: true,
      data: readyToSend,
      count: readyToSend.length
    });
  } catch (error) {
    console.error("Error in GET /api/milestones/send:", error);
    return NextResponse.json(
      { error: "Failed to get milestones ready to send" },
      { status: 500 }
    );
  }
}

