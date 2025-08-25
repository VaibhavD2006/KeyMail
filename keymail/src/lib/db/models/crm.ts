import { Schema, models, model } from 'mongoose';

const AddressSchema = new Schema(
	{
		street: { type: String, trim: true },
		city: { type: String, trim: true },
		state: { type: String, trim: true },
		postalCode: { type: String, trim: true },
		country: { type: String, trim: true },
	},
	{ _id: false }
);

const SocialSchema = new Schema(
	{
		linkedin: { type: String, trim: true },
		instagram: { type: String, trim: true },
		twitter: { type: String, trim: true },
		facebook: { type: String, trim: true },
		website: { type: String, trim: true },
	},
	{ _id: false }
);

const ContactWindowSchema = new Schema(
	{
		startHour: { type: Number, min: 0, max: 23, default: 9 },
		endHour: { type: Number, min: 0, max: 23, default: 17 },
		timezone: { type: String, trim: true },
	},
	{ _id: false }
);

function normalizeTags(input: unknown): string[] {
	if (!Array.isArray(input)) return [];
	const seen = new Set<string>();
	for (const raw of input) {
		if (typeof raw !== 'string') continue;
		const v = raw.trim().toLowerCase();
		if (!v) continue;
		seen.add(v);
	}
	return Array.from(seen);
}

const CRMRecordSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			index: true,
		},
		ownerId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			index: true,
		},
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
		},
		phone: {
			type: String,
			trim: true,
		},
		company: {
			type: String,
			trim: true,
		},
		stage: {
			type: String,
			enum: ['lead', 'prospect', 'active', 'client', 'closed', 'lost'],
			default: 'lead',
			index: true,
		},
		relationshipLevel: {
			type: String,
			enum: ['new', 'established', 'close'],
			default: 'new',
		},
		lifecycleStage: {
			type: String,
			enum: ['subscriber', 'lead', 'mql', 'sql', 'opportunity', 'customer', 'evangelist'],
			default: 'lead',
			index: true,
		},
		status: {
			type: String,
			enum: ['open', 'in_progress', 'won', 'lost', 'inactive'],
			default: 'open',
			index: true,
		},
		source: {
			type: String,
			trim: true,
		},
		tags: {
			type: [String],
			default: [],
			index: true,
			set: normalizeTags,
		},
		notes: {
			type: String,
			default: '',
		},
		address: {
			type: AddressSchema,
		},
		assignedTo: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			index: true,
		},
		dealValue: { type: Number, min: 0 },
		probability: { type: Number, min: 0, max: 1 },
		expectedCloseDate: { type: Date },
		lastActivityAt: {
			type: Date,
		},
		nextTaskAt: {
			type: Date,
		},
		lastEmailOpenedAt: { type: Date },
		lastLinkClickedAt: { type: Date },
		activityCount: { type: Number, default: 0, min: 0 },
		rating: { type: Number, min: 1, max: 5 },
		contactWindow: { type: ContactWindowSchema },
		marketingConsent: { type: Boolean, default: true },
		doNotContact: { type: Boolean, default: false },
		social: { type: SocialSchema },
		customFields: {
			type: Map,
			of: Schema.Types.Mixed,
			default: {},
		},
	},
	{
		timestamps: true,
	}
);

CRMRecordSchema.index({ userId: 1, stage: 1, lifecycleStage: 1, status: 1, createdAt: -1 });
CRMRecordSchema.index({ userId: 1, name: 'text', email: 'text', phone: 'text', company: 'text' });

// Ensure a stable id field on JSON/object outputs
CRMRecordSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (_doc, ret) => {
		if (ret._id) {
			ret.id = String(ret._id);
			delete ret._id;
		}
		return ret;
	},
});

CRMRecordSchema.set('toObject', {
	virtuals: true,
	versionKey: false,
	transform: (_doc, ret) => {
		if (ret._id) {
			ret.id = String(ret._id);
			delete ret._id;
		}
		return ret;
	},
});

export const CRMRecord = models.CRMRecord || model('CRMRecord', CRMRecordSchema);

export default CRMRecord;


