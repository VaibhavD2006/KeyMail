import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/session";
import { analyzeEmail } from "@/lib/ai/openai";

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
    const { content } = body;

    // Validate required fields
    if (!content) {
      return NextResponse.json(
        { success: false, error: "Email content is required" },
        { status: 400 }
      );
    }

    // Analyze email content
    const analysis = await analyzeEmail(content);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Error analyzing email content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze email content" },
      { status: 500 }
    );
  }
} 