import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photos: {
      type: Array,
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
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
  'active',
  'createdAt',
  'updatedAt',
];

export default mongoose.model('Category', CategorySchema);
