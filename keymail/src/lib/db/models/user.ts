import mongoose, { Schema, models, model } from 'mongoose';

const UserSettingsSchema = new Schema({
  timezone: {
    type: String,
    default: 'UTC',
  },
  emailSignature: {
    type: String,
    default: '',
  },
  defaultEmailTemplate: {
    type: String,
    default: '',
  },
});

const EmailIntegrationSchema = new Schema({
  provider: {
    type: String,
    enum: ['gmail', 'outlook', 'mailchimp'],
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    plan: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free',
    },
    settings: {
      type: UserSettingsSchema,
      default: () => ({}),
    },
    emailIntegration: {
      type: EmailIntegrationSchema,
    },
  },
  {
    timestamps: true,
  }
);

// Create or use existing model
export const User = models.User || model('User', UserSchema);

export default User; 