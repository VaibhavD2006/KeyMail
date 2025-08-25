import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import CRMRecord from '@/lib/db/models/crm';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
	try {
		await dbConnect();
		const record = await CRMRecord.findById(params.id).lean({ virtuals: true });
		if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
		return NextResponse.json({ success: true, data: { ...record, id: record.id || String(record._id) } }, { status: 200 });
	} catch (error: any) {
		console.error('CRM [id] GET error:', error);
		return NextResponse.json({ success: false, error: 'Failed to fetch CRM record', details: error?.message }, { status: 500 });
	}
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		await dbConnect();
		const update = await req.json();
		const updated = await CRMRecord.findByIdAndUpdate(params.id, update, { new: true }).lean({ virtuals: true });
		if (!updated) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
		return NextResponse.json({ success: true, data: { ...updated, id: updated.id || String(updated._id) } }, { status: 200 });
	} catch (error: any) {
		console.error('CRM [id] PUT error:', error);
		return NextResponse.json({ success: false, error: 'Failed to update CRM record', details: error?.message }, { status: 500 });
	}
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
	try {
		await dbConnect();
		await CRMRecord.findByIdAndDelete(params.id);
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error: any) {
		console.error('CRM [id] DELETE error:', error);
		return NextResponse.json({ success: false, error: 'Failed to delete CRM record', details: error?.message }, { status: 500 });
	}
}


