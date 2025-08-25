import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Deprecated. Use /api/crm/[id]" }, { status: 410 });
}

export async function PUT() {
  return NextResponse.json({ error: "Deprecated. Use /api/crm/[id]" }, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Deprecated. Use /api/crm/[id]" }, { status: 410 });
} 