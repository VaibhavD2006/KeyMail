import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { setupDatabase } from "@/lib/db/setup";
import { ensureDatabaseSetup } from "@/lib/db/migration";

/**
 * API endpoint to trigger database setup
 * Only available in development or test mode for security reasons
 */
export async function GET(req: NextRequest) {
  console.log("API setup endpoint called");
  
  // Only allow database setup in development or test mode
  const isDev = process.env.NODE_ENV === "development";
  const isTest = process.env.NODE_ENV === "test";
  
  if (!isDev && !isTest) {
    console.warn("Attempted to call setup endpoint in production mode");
    return NextResponse.json(
      { error: "Setup endpoint only available in development or test mode" },
      { status: 403 }
    );
  }
  
  try {
    // In production we would check for authentication,
    // but for simplicity we skip it in development
    if (!isDev && !isTest) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    
    console.log("Running database setup...");
    
    // First, ensure the database exists and run migrations
    const dbSetupResult = await ensureDatabaseSetup();
    if (!dbSetupResult) {
      console.error("Database setup failed in setup endpoint");
      return NextResponse.json(
        { error: "Failed to set up database", success: false },
        { status: 500 }
      );
    }
    
    // Then set up the specific tables and data we need
    console.log("Running application-specific database setup...");
    const result = await setupDatabase();
    
    console.log("Database setup completed successfully");
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Error in database setup endpoint:", error);
    
    // In development, return the error details for debugging
    const errorMessage = isDev 
      ? `Database setup failed: ${error instanceof Error ? error.message : String(error)}`
      : "Database setup failed";
    
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
} 