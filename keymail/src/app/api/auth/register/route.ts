import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/db/queries-mongodb";
import { ApiResponse } from "@/types";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, companyName } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already in use" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create new user
    const newUser = await createUser({
      name,
      email,
      passwordHash,
      companyName: companyName || "",
      plan: "free",
      settings: {
        timezone: "UTC",
      },
    });

    // Return success response without sensitive data
    return NextResponse.json(
      {
        success: true,
        data: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register user" },
      { status: 500 }
    );
  }
} 