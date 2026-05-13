import { Schema, models, model } from 'mongoose';

const ShowingFeedbackSchema = new Schema(
  {
    showingId: {
      type: String,
      required: true,
      index: true,
    },
    clientId: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    liked: {
      type: Boolean,
    },
    comments: {
      type: String,
    },
    followUpNeeded: {
      type: Boolean,
      default: false,
    },
    nextAction: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ShowingFeedbackSchema.index({ showingId: 1, clientId: 1 });

export const ShowingFeedback = models.ShowingFeedback || model('ShowingFeedback', ShowingFeedbackSchema);

export default ShowingFeedback;
