import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getEmailById,
  updateEmail,
  deleteEmail,
  markEmailAsSent,
  toggleEmailFavorite,
} from "@/lib/db/emails";

// GET /api/emails/[id]
export async function GET(
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

    // Get URL parameters
    const searchParams = req.nextUrl.searchParams;
    const includeClient = searchParams.get("includeClient") === "true";

    // Get email by ID
    const email = await getEmailById(params.id, session.user.id, includeClient);
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: email });
  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch email" },
      { status: 500 }
    );
  }
}

// PUT /api/emails/[id]
export async function PUT(
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

    // Parse request body
    const body = await req.json();

    // Check if email exists
    const existingEmail = await getEmailById(params.id, session.user.id);
    if (!existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email not found" },
        { status: 404 }
      );
    }

    // Update email
    const updatedEmail = await updateEmail(params.id, body, session.user.id);

    if (!updatedEmail) {
      return NextResponse.json(
        { success: false, error: "Failed to update email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: updatedEmail });
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update email" },
      { status: 500 }
    );
  }
}

// DELETE /api/emails/[id]
export async function DELETE(
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

    // Delete email
    const deletedEmail = await deleteEmail(params.id, session.user.id);

    if (!deletedEmail) {
      return NextResponse.json(
        { success: false, error: "Failed to delete email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: deletedEmail });
  } catch (error) {
    console.error("Error deleting email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete email" },
      { status: 500 }
    );
  }
} 