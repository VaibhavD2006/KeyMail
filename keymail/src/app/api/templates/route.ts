import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const templates = await prisma.template.findMany();
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const template = await prisma.template.create({ data });
  return NextResponse.json(template);
}

export async function PATCH(req: NextRequest) {
  const { id, ...fields } = await req.json();
  const template = await prisma.template.update({ where: { id }, data: fields });
  return NextResponse.json(template);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 