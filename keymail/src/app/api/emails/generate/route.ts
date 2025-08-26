import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateEmail } from '@/lib/gpt';

export async function POST(req: NextRequest) {
  const { prompt, templateId } = await req.json();
  const template = await prisma.template.findUnique({ where: { id: templateId } });
  if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  const content = await generateEmail({ prompt, template: template.body });
  return NextResponse.json({ content });
} 