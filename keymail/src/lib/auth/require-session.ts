import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./session";

export async function requireUserSession() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ? session : null;
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  );
}
