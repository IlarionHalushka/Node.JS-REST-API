import Joi from 'joi';
import { validateRequest } from './utils';

const signUpSchema = Joi.object().keys({
  firstName: Joi.string()
    .trim()
    .required(0),
  lastName: Joi.string()
    .trim()
    .required(0),
  email: Joi.string()
    .trim()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
  passwordConfirmation: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .options({ language: { any: { allowOnly: 'must match password' } } }),
});

const signInSchema = Joi.object().keys({
  email: Joi.string()
    .trim()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
});

export const signUp = validateRequest(signUpSchema);

export const signIn = validateRequest(signInSchema);
