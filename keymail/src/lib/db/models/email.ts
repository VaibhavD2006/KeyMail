import mongoose, { Schema, models, model } from 'mongoose';

const EmailMetadataSchema = new Schema({
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'Template',
  },
  aiParameters: {
    tone: String,
    style: String,
    length: String,
  },
});

const EmailAnalyticsSchema = new Schema({
  opened: {
    type: Boolean,
    default: false,
  },
  openedAt: Date,
  clicked: {
    type: Boolean,
    default: false,
  },
  clickedAt: Date,
});

const EmailSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },
    occasion: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    generatedContent: {
      type: String,
      required: true,
    },
    editedContent: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'sent', 'failed'],
      default: 'draft',
      index: true,
    },
    scheduledDate: {
      type: Date,
      index: true,
    },
    sentDate: {
      type: Date,
    },
    metadata: {
      type: EmailMetadataSchema,
      default: () => ({}),
    },
    analytics: {
      type: EmailAnalyticsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
EmailSchema.index({ userId: 1, status: 1 });
EmailSchema.index({ userId: 1, clientId: 1 });
EmailSchema.index({ scheduledDate: 1, status: 1 });

// Create or use existing model
export const Email = models.Email || model('Email', EmailSchema);

export default Email; 