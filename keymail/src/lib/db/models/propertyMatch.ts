import mongoose, { Schema, models, model } from 'mongoose';

const PropertyMatchSchema = new Schema(
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
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    reasons: [{
      type: String,
    }],
    sentEmailId: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes
PropertyMatchSchema.index({ userId: 1, isActive: 1, matchScore: -1 });
PropertyMatchSchema.index({ clientId: 1, isActive: 1 });
PropertyMatchSchema.index({ listingId: 1 });

export const PropertyMatch = models.PropertyMatch || model('PropertyMatch', PropertyMatchSchema);

export default PropertyMatch;

