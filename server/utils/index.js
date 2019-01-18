import jwt from 'jsonwebtoken';
import { codes } from '../constants';

export const getTokenClaim = async (token, secret) => {
  let tokenClaim;

  try {
    tokenClaim = await jwt.verify(token, secret);
  } catch (error) {
    const responseError = new Error('ERR_INVALID_TOKEN');
    responseError.status = codes.BAD_REQUEST;

    throw responseError;
  }

  return tokenClaim;
};

export const escapeRegexSpecialChars = stringWithRegexSpecialChars =>
  stringWithRegexSpecialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const throwError = (res, error) => {
  const { message, status = codes.INTERNAL_SERVER_ERROR, data } = error;

  console.error(error); // es-lint-disable-line

  res.status(status).json({
    error: message,
    data,
  });
};

export const wrapAsyncError = endpoint => async (req, res) => {
  try {
    await endpoint(req, res);
  } catch (error) {
    throwError(res, error);
  }
};
