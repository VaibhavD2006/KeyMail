import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/session";
import { getClientById } from "@/lib/db/queries-mongodb";
import { generateEmailContent } from "@/lib/ai/openai";

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
    const { clientId, occasion, tone, style, length, additionalContext } = body;

    // Validate required fields
    if (!clientId || !occasion) {
      return NextResponse.json(
        { success: false, error: "Client ID and occasion are required" },
        { status: 400 }
      );
    }

    // Get client information
    const client = await getClientById(clientId, session.user.id);

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    // Generate email content
    const generatedEmail = await generateEmailContent({
      client,
      occasion,
      tone,
      style,
      length,
      additionalContext,
    });

    return NextResponse.json({
      success: true,
      data: generatedEmail,
    });
  } catch (error) {
    console.error("Error generating email content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate email content" },
      { status: 500 }
    );
  }
} 