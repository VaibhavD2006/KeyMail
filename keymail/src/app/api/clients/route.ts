import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const clients = await prisma.client.findMany();
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const client = await prisma.client.create({ data });
  return NextResponse.json(client);
}

export async function PATCH(req: NextRequest) {
  const { id, ...fields } = await req.json();
  const client = await prisma.client.update({ where: { id }, data: fields });
  return NextResponse.json(client);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 