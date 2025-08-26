import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  const { to, subject, body, from } = await req.json();
  const result = await sendEmail({ to, subject, body, from });
  return NextResponse.json(result);
}
