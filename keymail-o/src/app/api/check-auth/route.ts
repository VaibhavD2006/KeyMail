import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { handler as authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  // Pass the auth options to getServerSession
  const session = await getServerSession();
  
  // Log for debugging
  console.log("Check Auth Session:", session);
  
  // Check if user is authenticated
  if (session) {
    // User is authenticated, they should be on dashboard
    return NextResponse.json({ 
      authenticated: true, 
      shouldRedirect: "/dashboard",
      user: session.user 
    });
  } else {
    // User is not authenticated, they should be on login
    return NextResponse.json({ 
      authenticated: false, 
      shouldRedirect: "/login" 
    });
  }
} 