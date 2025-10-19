import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getEmailById, markEmailAsSent } from "@/lib/db/emails";

// POST /api/emails/[id]/send
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if email exists
    const existingEmail = await getEmailById(params.id, session.user.id);
    if (!existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email not found" },
        { status: 404 }
      );
    }

    // Mark email as sent
    const sentEmail = await markEmailAsSent(params.id, session.user.id);

    if (!sentEmail) {
      return NextResponse.json(
        { success: false, error: "Failed to mark email as sent" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sentEmail,
      message: "Email marked as sent successfully",
    });
  } catch (error) {
    console.error("Error marking email as sent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark email as sent" },
      { status: 500 }
    );
  }
} 