import mongoose from 'mongoose';
import { User } from '../models';

exports.signup = (req, res) => {
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
        .then(resultSaving => {
          res.status(201).json({
            message: 'New user is created successfully.',
            data: resultSaving,
          });
        })
        .catch(errSaving => {
          res.status(500).json({
            error: errSaving,
          });
        });
    });
};
