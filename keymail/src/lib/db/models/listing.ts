import mongoose, { Schema, models, model } from 'mongoose';

const ListingSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    mlsId: {
      type: String,
      unique: true,
      sparse: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    photos: [{
      type: String,
    }],
    features: [{
      type: String,
    }],
    bedrooms: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    squareFeet: {
      type: Number,
    },
    lotSize: {
      type: Number,
    },
    propertyType: {
      type: String,
      enum: ['single_family', 'condo', 'townhouse', 'multi_family', 'land'],
    },
    neighborhood: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'pending', 'withdrawn'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
ListingSchema.index({ userId: 1, status: 1 });
ListingSchema.index({ mlsId: 1 });

export const Listing = models.Listing || model('Listing', ListingSchema);

export default Listing;

