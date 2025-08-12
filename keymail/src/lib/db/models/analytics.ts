import mongoose, { Schema, models, model } from 'mongoose';

const AnalyticsMetricsSchema = new Schema({
  emailsSent: {
    type: Number,
    default: 0,
  },
  emailsOpened: {
    type: Number,
    default: 0,
  },
  clickThroughRate: {
    type: Number,
    default: 0,
  },
  clientEngagement: {
    type: Number,
    default: 0,
  },
});

const AnalyticsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    metrics: {
      type: AnalyticsMetricsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
AnalyticsSchema.index({ userId: 1, period: 1, date: 1 }, { unique: true });
AnalyticsSchema.index({ date: 1 });

// Create or use existing model
export const Analytics = models.Analytics || model('Analytics', AnalyticsSchema);

export default Analytics; 