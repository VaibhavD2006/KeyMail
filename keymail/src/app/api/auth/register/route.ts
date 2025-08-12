import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/db/queries";
import { ApiResponse } from "@/types";

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

    // In a real application, you would hash the password here
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await createUser({
      name,
      email,
      // password: hashedPassword,
      password, // For demo purposes only, in a real app you would use the hashed password
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