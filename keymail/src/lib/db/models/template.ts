import mongoose, { Schema, models, model } from 'mongoose';

const TemplateMetadataSchema = new Schema({
  tone: String,
  occasion: String,
  suggestedUse: String,
});

const TemplateSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    variables: {
      type: [String],
      default: [],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: TemplateMetadataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
TemplateSchema.index({ userId: 1, category: 1 });
TemplateSchema.index({ userId: 1, isDefault: 1 });
TemplateSchema.index({ name: 'text' });

// Create or use existing model
export const Template = models.Template || model('Template', TemplateSchema);

export default Template; 