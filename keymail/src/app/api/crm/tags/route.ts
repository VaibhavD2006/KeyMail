import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import CRMRecord from '@/lib/db/models/crm';

export async function GET() {
	await dbConnect();
	const tags: Array<{ _id: string; count: number }> = await CRMRecord.aggregate([
		{ $unwind: '$tags' },
		{ $group: { _id: '$tags', count: { $sum: 1 } } },
		{ $sort: { count: -1, _id: 1 } },
	]);
	return NextResponse.json({ data: tags });
}


