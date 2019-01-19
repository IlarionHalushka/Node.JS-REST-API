import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models';
import * as utils from '../utils';
import { CODES, MESSAGES } from '../constants';

export const signUp = async (req, res) => {
  // check for already registered email
  const isUserExists = await User.find({
    email: req.body.email,
  }).countDocuments();

  if (isUserExists) {
    return res.status(CODES.CONFLICT).json({
      message: MESSAGES.EMAIL_ALREADY_REGISTERED,
    });
  }

  // create new user
  const userToCreate = new User({
    _id: new mongoose.Types.ObjectId(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  });

  await userToCreate.save();
  return res.status(CODES.CREATED).json({
    message: MESSAGES.CREATED,
  });
};

export const signIn = async (req, res) => {
  // find user in DB
  const userFromDB = await User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(CODES.UNAUTHORIZED).json({
          message: MESSAGES.AUTH_FAILED,
        });
      }
      return user;
    });

  // if user was found in DB check password hashes and return response
  bcrypt.compare(req.body.password, userFromDB[0].password, (err, result) => {
    if (err) {
      return res.status(CODES.UNAUTHORIZED).json({
        message: MESSAGES.AUTH_FAILED,
      });
    }
    if (result) {
      const tokenJwt = jwt.sign(
        {
          email: userFromDB[0].email,
          userId: userFromDB[0]._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: '1h',
        },
      );
      return res.status(CODES.SUCCESS).json({
        message: MESSAGES.AUTH_SUCCESSFUL,
        token: tokenJwt,
      });
    }
    return res.status(CODES.UNAUTHORIZED).json({
      message: MESSAGES.AUTH_FAILED,
    });
  });
};

const getLoggedInUser = async req => {
  const { authorization: token } = req.headers;

  const { userId } = await utils.getTokenClaim(token, process.env.JWT_KEY);

  const user = await User.findOne({ _id: userId });

  if (!user) {
    const error = new Error(MESSAGES.NOT_LOGGED_IN);
    error.status = CODES.UNAUTHORIZED;
    throw error;
  }

  if (user.banned) {
    const error = new Error(MESSAGES.USER_BANNED);
    error.status = CODES.UNAUTHORIZED;
    throw error;
  }

  return user;
};

export const requireLogin = () => async (req, res, next) => {
  let user;

  try {
    user = await getLoggedInUser(req);
  } catch (error) {
    return next(error);
  }

  req.user = user;
  return next();
};

export const requireAdminLogin = () => async (req, res, next) => {
  let user;

  try {
    user = await getLoggedInUser(req);
  } catch (err) {
    return next(err);
  }

  if (!user.isAdmin()) {
    const error = new Error(MESSAGES.UNAUTHORIZED);
    error.status = CODES.UNAUTHORIZED;
    return next(error);
  }

  req.user = user;
  return next();
};
