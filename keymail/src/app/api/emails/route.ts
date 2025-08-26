import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const emails = await prisma.email.findMany({ include: { client: true, template: true } });
  return NextResponse.json(emails);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const email = await prisma.email.create({ data });
  return NextResponse.json(email);
}

export async function PATCH(req: NextRequest) {
  const { id, ...fields } = await req.json();
  const email = await prisma.email.update({ where: { id }, data: fields });
  return NextResponse.json(email);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.email.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 