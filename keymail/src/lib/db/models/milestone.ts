import mongoose, { Schema, models, model } from 'mongoose';

const MilestoneSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    clientId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['home_anniversary', 'birthday', 'personal_event', 'closing'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
    },
    lastSent: {
      type: Date,
    },
    nextSendDate: {
      type: Date,
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailTemplateId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for efficient querying
MilestoneSchema.index({ userId: 1, isActive: 1, nextSendDate: 1 });
MilestoneSchema.index({ userId: 1, clientId: 1 });

// Create or use existing model
export const Milestone = models.Milestone || model('Milestone', MilestoneSchema);

export default Milestone;

