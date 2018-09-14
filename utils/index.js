import jwt from 'jsonwebtoken';

export const getTokenClaim = async (token, secret) => {
  let tokenClaim;

  try {
    tokenClaim = await jwt.verify(token, secret);
  } catch (error) {
    const responseError = new Error('ERR_INVALID_TOKEN');
    responseError.status = 400;

    throw responseError;
  }

  return tokenClaim;
};

export const escapeRegexSpecialChars = stringWithRegexSpecialChars =>
  stringWithRegexSpecialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
