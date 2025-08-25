import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import CRMRecord from '@/lib/db/models/crm';

function parseNumber(value: string | null, defaultValue: number): number {
	if (!value) return defaultValue;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? defaultValue : parsed;
}

export async function GET(req: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get('userId');
		const stage = searchParams.get('stage');
		const lifecycleStage = searchParams.get('lifecycleStage');
		const status = searchParams.get('status');
		const tag = searchParams.get('tag');
		const anyTag = searchParams.getAll('tag');
		const q = searchParams.get('q');
		const page = parseNumber(searchParams.get('page'), 1);
		const pageSize = parseNumber(searchParams.get('pageSize'), 20);

		const filter: any = {};
		if (userId) filter.userId = userId;
		if (stage) filter.stage = stage;
		if (lifecycleStage) filter.lifecycleStage = lifecycleStage;
		if (status) filter.status = status;
		if (tag) filter.tags = tag;
		if (anyTag && anyTag.length > 1) filter.tags = { $in: anyTag };
		if (q) {
			filter.$or = [
				{ name: { $regex: q, $options: 'i' } },
				{ email: { $regex: q, $options: 'i' } },
				{ phone: { $regex: q, $options: 'i' } },
				{ company: { $regex: q, $options: 'i' } },
			];
		}

		const skip = (page - 1) * pageSize;
		const [itemsRaw, total] = await Promise.all([
			CRMRecord.find(filter)
				.sort({ updatedAt: -1 })
				.skip(skip)
				.limit(pageSize)
				.lean({ virtuals: true }),
			CRMRecord.countDocuments(filter),
		]);

		const items = itemsRaw.map((r: any) => ({ ...r, id: r.id || String(r._id) }));
		return NextResponse.json({ success: true, data: { items, total, page, pageSize } }, { status: 200 });
	} catch (error: any) {
		console.error('CRM GET error:', error);
		return NextResponse.json({ success: false, error: 'Failed to fetch CRM records', details: error?.message }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		await dbConnect();
		const body = await req.json();
		if (Array.isArray(body)) {
			const valid = body.filter((r) => r?.userId && r?.name);
			if (valid.length === 0) {
				return NextResponse.json({ error: 'userId and name are required for each record' }, { status: 400 });
			}
			const createdMany = await CRMRecord.insertMany(valid.map((r) => ({
				...r,
				lastActivityAt: r?.lastActivityAt ?? new Date(),
			})));
			return NextResponse.json({ data: createdMany }, { status: 201 });
		}
		if (!body?.name) {
			return NextResponse.json({ error: 'userId and name are required' }, { status: 400 });
		}
		const created = await CRMRecord.create({ ...body, lastActivityAt: body?.lastActivityAt ?? new Date() });
		return NextResponse.json({ success: true, data: created.toJSON() }, { status: 201 });
	} catch (error: any) {
		console.error('CRM POST error:', error);
		return NextResponse.json({ success: false, error: 'Failed to create CRM record', details: error?.message }, { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	try {
		await dbConnect();
		const body = await req.json();
		const { _id, id, ...update } = body || {};
		const recordId = _id || id;
		if (!recordId) return NextResponse.json({ error: 'id is required' }, { status: 400 });
		const updated = await CRMRecord.findByIdAndUpdate(recordId, update, { new: true }).lean({ virtuals: true });
		if (!updated) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
		return NextResponse.json({ success: true, data: { ...updated, id: updated.id || String(updated._id) } }, { status: 200 });
	} catch (error: any) {
		console.error('CRM PUT error:', error);
		return NextResponse.json({ success: false, error: 'Failed to update CRM record', details: error?.message }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		await dbConnect();
		const body = await req.json();
		const { id } = body || {};
		if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
		await CRMRecord.findByIdAndDelete(id);
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error: any) {
		console.error('CRM DELETE error:', error);
		return NextResponse.json({ success: false, error: 'Failed to delete CRM record', details: error?.message }, { status: 500 });
	}
}


