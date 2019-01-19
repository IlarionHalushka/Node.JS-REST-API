import mongoose from 'mongoose';
import { BaseModel, baseModelPublicFields } from './BaseModel';

const options = { discriminatorKey: 'kind' };

const SupplierSchema = BaseModel.discriminator(
  'Supplier',
  new mongoose.Schema(
    {
      description: {
        type: String,
      },
      photos: {
        type: Array,
        default: [],
      },
    },
    options,
  ),
);

export const publicFields = ['name', 'photos', 'description'].push(baseModelPublicFields);

export default SupplierSchema;
