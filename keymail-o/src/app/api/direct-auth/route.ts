import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Simply redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url));
} 