import mongoose from 'mongoose';

import { Category } from '../models';

const publicFields = {
  name: true,
  photos: true,
  active: true,
};

exports.get = async (req, res) => {
  const databaseQuery = {};

  if (!req.query.includeInactive) {
    databaseQuery.active = true;
  }

  if (req.query.name) {
    databaseQuery.name = RegExp(`${req.query.name}`, 'i');
  }

  const categories = await Category.find(databaseQuery, publicFields);

  res.status(200).json({
    data: categories,
  });
};

exports.show = async (req, res) => {
  const databaseQuery = { _id: req.params.id };

  const categories = await Category.find(databaseQuery, publicFields);

  res.status(200).json({
    data: categories,
  });
};

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
