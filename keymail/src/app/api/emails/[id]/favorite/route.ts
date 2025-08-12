import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getEmailById, toggleEmailFavorite } from "@/lib/db/emails";

// POST /api/emails/[id]/favorite - Toggle email favorite status
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

    // Toggle favorite status
    const updatedEmail = await toggleEmailFavorite(params.id, session.user.id);

    if (!updatedEmail) {
      return NextResponse.json(
        { success: false, error: "Failed to toggle favorite status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedEmail,
      message: `Email ${updatedEmail.isFavorite ? "marked as favorite" : "removed from favorites"}`,
    });
  } catch (error) {
    console.error("Error toggling email favorite status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle favorite status" },
      { status: 500 }
    );
  }
} 