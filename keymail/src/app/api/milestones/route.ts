import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const milestones = await prisma.milestone.findMany({ include: { client: true } });
  return NextResponse.json(milestones);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const milestone = await prisma.milestone.create({ data });
  return NextResponse.json(milestone);
}

export async function PATCH(req: NextRequest) {
  const { id, ...fields } = await req.json();
  const milestone = await prisma.milestone.update({ where: { id }, data: fields });
  return NextResponse.json(milestone);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.milestone.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

