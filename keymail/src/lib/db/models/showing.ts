import mongoose, { Schema, models, model } from 'mongoose';

const ShowingSchema = new Schema(
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
    listingId: {
      type: String,
      required: true,
      index: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },
    completedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
      default: 'scheduled',
      index: true,
    },
    agentNotes: {
      type: String,
    },
    followUpSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes
ShowingSchema.index({ userId: 1, scheduledAt: -1 });
ShowingSchema.index({ clientId: 1, scheduledAt: -1 });
ShowingSchema.index({ listingId: 1, scheduledAt: -1 });
ShowingSchema.index({ userId: 1, status: 1 });

export const Showing = models.Showing || model('Showing', ShowingSchema);

export default Showing;

