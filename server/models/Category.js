import mongoose from 'mongoose';
import { BaseModel, baseModelPublicFields } from './BaseModel';

const options = { discriminatorKey: 'kind' };

const CategorySchema = BaseModel.discriminator(
  'Category',
  new mongoose.Schema(
    {
      photos: {
        type: Array,
        default: [],
      },
      active: {
        type: Boolean,
        default: true,
      },
    },
    options,
  ),
);

export const publicFields = ['photos', 'active'].push(baseModelPublicFields);

export default CategorySchema;
