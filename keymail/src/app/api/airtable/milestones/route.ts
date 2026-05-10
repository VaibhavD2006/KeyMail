import { NextRequest, NextResponse } from 'next/server';
import { getTable } from '@/lib/airtable';
import { requireUserSession, unauthorizedResponse } from '@/lib/auth/require-session';

const table = getTable('Milestones');

export async function GET() {
  if (!(await requireUserSession())) {
    return unauthorizedResponse();
  }

  const records = await table.select().all();
  return NextResponse.json(records.map(r => ({ id: r.id, ...r.fields })));
}

export async function POST(req: NextRequest) {
  if (!(await requireUserSession())) {
    return unauthorizedResponse();
  }

  const data = await req.json();
  const created = await table.create([{ fields: data }]);
  return NextResponse.json({ id: created[0].id, ...created[0].fields });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireUserSession())) {
    return unauthorizedResponse();
  }

  const { id, ...fields } = await req.json();
  const updated = await table.update([{ id, fields }]);
  return NextResponse.json({ id: updated[0].id, ...updated[0].fields });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireUserSession())) {
    return unauthorizedResponse();
  }

  const { id } = await req.json();
  await table.destroy([id]);
  return NextResponse.json({ success: true });
}
