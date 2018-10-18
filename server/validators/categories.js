import Joi from 'joi';
import { validateRequest } from './utils';

const categorySchema = Joi.object().keys({
  name: Joi.string().required(),
  photos: Joi.array(),
  active: Joi.boolean(),
});

const updateCategorySchema = Joi.object().keys({
  name: Joi.string().allow(''),
  photos: Joi.array(),
  active: Joi.boolean(),
});

export const create = validateRequest(categorySchema);

export const update = validateRequest(updateCategorySchema);
