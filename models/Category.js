import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      $type: String,
      required: true,
    },
    photos: {
      $type: Array,
      default: [],
    },
    active: {
      $type: Boolean,
      default: true,
    },
  },
  {
    typeKey: '$type',
  },
);

export default mongoose.model('Category', CategorySchema);
