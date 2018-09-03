import mongoose from 'mongoose';

import { Category } from '../models';

exports.create = async (req, res) => {
  // check for already registered category name
  await Category.find({ name: req.body.name })
    .exec()
    .then(category => {
      if (category.length >= 1) {
        return res.status(409).json({
          message: 'Category is already created.',
        });
      }
      return category;
    })
    .catch(errFinding => {
      res.status(500).json({
        error: errFinding,
      });
    });

  // create new category
  const categoryToCreate = new Category({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    photos: req.body.photos,
    active: req.body.active,
  });

  categoryToCreate
    .save()
    .then(() =>
      res.status(201).json({
        message: 'New category is created successfully.',
      }),
    )
    .catch(errSaving => {
      res.status(500).json({
        error: errSaving,
      });
    });
};
