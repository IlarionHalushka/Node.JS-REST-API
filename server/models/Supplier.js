import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    photos: {
      type: Array,
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  },
);

export const publicFields = [
  'name',
  'photos',
  'description',
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
];

export const Supplier = mongoose.model('Supplier', SupplierSchema);
