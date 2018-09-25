import mongoose from 'mongoose';

const options = {
  discriminatorKey: 'kind',
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
};

const BaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
  options,
);

export const baseModelPublicFields = [
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
];

export const BaseModel = mongoose.model('BaseModel', BaseSchema);
