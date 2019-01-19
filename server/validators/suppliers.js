import Joi from 'joi';
import { validateRequest } from './utils';

const supplierSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  photos: Joi.array(),
});

const updateSupplierSchema = Joi.object().keys({
  name: Joi.string().allow(''),
  description: Joi.string().allow(''),
  photos: Joi.array(),
});

export const create = validateRequest(supplierSchema);
export const update = validateRequest(updateSupplierSchema);
