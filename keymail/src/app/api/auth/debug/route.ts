import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/session";

export async function GET() {
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    
    // Safely get token info
    let tokenInfo = "No token available";
    try {
      // This is a hack to get the raw token for debugging
      // @ts-ignore - We're accessing private properties for debugging
      const token = await (authOptions.callbacks?.jwt as any)?.({
        token: session?.user || {},
      });
      tokenInfo = token || "No token generated";
    } catch (e) {
      tokenInfo = `Error getting token: ${e}`;
    }

    // Check that env variables are properly set
    const envCheck = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "Not set",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set (hidden)" : "Not set",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set (hidden)" : "Not set",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Set (hidden)" : "Not set",
      NODE_ENV: process.env.NODE_ENV || "Not set",
    };

    return NextResponse.json({
      status: "OK",
      session,
      tokenInfo,
      envCheck,
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Auth debug error:", error);
    return NextResponse.json(
      { error: "Failed to get session", details: String(error) },
      { status: 500 }
    );
  }
} 