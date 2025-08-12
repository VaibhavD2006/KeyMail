import mongoose, { Schema, models, model } from 'mongoose';

const ClientPreferencesSchema = new Schema({
  communicationFrequency: {
    type: String,
    enum: ['weekly', 'monthly', 'quarterly'],
    default: 'monthly',
  },
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'text'],
    default: 'email',
  },
});

const ClientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    birthday: {
      type: Date,
    },
    closingAnniversary: {
      type: Date,
    },
    yearsKnown: {
      type: Number,
      min: 0,
    },
    relationshipLevel: {
      type: String,
      enum: ['new', 'established', 'close'],
      default: 'new',
    },
    tags: {
      type: [String],
      default: [],
    },
    customFields: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    preferences: {
      type: ClientPreferencesSchema,
      default: () => ({}),
    },
    lastContactDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ClientSchema.index({ email: 1, userId: 1 }, { unique: true });
ClientSchema.index({ name: 'text' });
ClientSchema.index({ tags: 1 });
ClientSchema.index({ birthday: 1 });
ClientSchema.index({ closingAnniversary: 1 });

// Create or use existing model
export const Client = models.Client || model('Client', ClientSchema);

export default Client; 