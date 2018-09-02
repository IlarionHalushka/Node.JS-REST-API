import Joi from 'joi';

const getInvalidRequestError = data => {
  const responseError = new Error('ERR_INVALID_REQUEST');
  responseError.status = 400;
  responseError.data = data;

  return responseError;
};

export const validateRequest = schema => (req, res, next) => {
  const { error, value } = Joi.validate(req.body, schema);

  if (error) {
    return res.status(400).json({
      message: error.details,
    });
  }

  req.body = value;
  return next();
};

export const validateQuery = schema => (req, res, next) => {
  const { error, value } = Joi.validate(req.query, schema);

  if (error) {
    return next(getInvalidRequestError(error.details));
  }

  req.query = value;
  return next();
};
