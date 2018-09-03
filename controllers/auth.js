import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models';

exports.signUp = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email is already registered.',
        });
      }
      const userToCreate = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation,
      });

      return userToCreate
        .save()
        .then(() => {
          res.status(201).json({
            message: 'New user is created successfully.',
          });
        })
        .catch(errSaving => {
          res.status(500).json({
            error: errSaving,
          });
        });
    });
};

exports.signIn = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      return bcrypt.compare(
        req.body.password,
        user[0].password,
        (err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'Auth failed',
            });
          }
          if (result) {
            const tokenJwt = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id,
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
        },
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
