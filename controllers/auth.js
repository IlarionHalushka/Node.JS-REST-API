import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models';
import * as utils from '../utils';

exports.signUp = async (req, res) => {
  // check for already registered email
  await User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email is already registered.',
        });
      }
      return user;
    })
    .catch(errFinding => {
      res.status(500).json({
        error: errFinding,
      });
    });

  // create new user
  const userToCreate = new User({
    _id: new mongoose.Types.ObjectId(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  });

  userToCreate
    .save()
    .then(() =>
      res.status(201).json({
        message: 'New user is created successfully.',
      }),
    )
    .catch(errSaving => {
      res.status(500).json({
        error: errSaving,
      });
    });
};

exports.signIn = async (req, res) => {
  // find user in DB
  const userFromDB = await User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      return user;
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });

  // if user was found in DB check password hashes and return response
  bcrypt.compare(req.body.password, userFromDB[0].password, (err, result) => {
    if (err) {
      return res.status(401).json({
        message: 'Auth failed',
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
      return res.status(200).json({
        message: 'Auth successful',
        token: tokenJwt,
      });
    }
    return res.status(401).json({
      message: 'Auth failed',
    });
  });
};

const getLoggedInUser = async req => {
  const { authorization: token } = req.headers;

  const { userId } = await utils.getTokenClaim(token, process.env.JWT_KEY);

  const user = await User.findOne({ _id: userId });

  if (!user) {
    const error = new Error('ERR_NOT_LOGGED_IN');
    error.status = 401;
    throw error;
  }

  if (user.banned) {
    const error = new Error('ERR_USER_BANNED');
    error.status = 401;
    throw error;
  }

  return user;
};

exports.requireLogin = () => async (req, res, next) => {
  let user;

  try {
    user = await getLoggedInUser(req);
  } catch (error) {
    return next(error);
  }

  req.user = user;
  return next();
};

exports.requireAdminLogin = () => async (req, res, next) => {
  let user;

  console.log(user, 'require ADMIN LOGIN');

  try {
    user = await getLoggedInUser(req);
  } catch (err) {
    return next(err);
  }

  if (!user.isAdmin()) {
    const error = new Error('ERR_USER_IS_NOT_AN_ADMIN');
    error.status = 401;
    return next(error);
  }

  req.user = user;
  return next();
};
