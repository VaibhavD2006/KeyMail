import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/session";
import { enhanceEmail } from "@/lib/ai/openai";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subject, content, improvements } = body;

    // Validate required fields
    if (!subject || !content || !improvements) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Subject, content, and improvement instructions are required" 
        },
        { status: 400 }
      );
    }

    // Enhance email content
    const enhancedEmail = await enhanceEmail({
      subject,
      content,
      improvements,
    });

    return NextResponse.json({
      success: true,
      data: enhancedEmail,
    });
  } catch (error) {
    console.error("Error enhancing email content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to enhance email content" },
      { status: 500 }
    );
  }
} 