import mongoose from 'mongoose';

import { Category } from '../models';
import { escapeRegexSpecialChars } from '../utils';

exports.get = async (req, res) => {
  const databaseQuery = {};

  if (
    req.query.includeInactive === undefined ||
    req.query.includeInactive === 'false'
  ) {
    databaseQuery.active = true;
  }

  if (req.query.name) {
    escapeRegexSpecialChars(req.query.name);

    databaseQuery.name = new RegExp(`${req.query.name}`, 'i');
  }

  const categories = await Category.find(
    databaseQuery,
    Category.publicFields,
  ).catch(errFinding => res.status(500).json({ error: errFinding }));

  return res.status(200).json({
    data: categories,
  });
};

exports.show = async (req, res) => {
  const databaseQuery = { _id: req.params.id };

  const category = await Category.findOne(databaseQuery, Category.publicFields);

  return res.status(200).json({
    data: category,
  });
};

exports.create = async (req, res) => {
  // check for already registered category name
  const isCategoryExists = await Category.find({ name: req.body.name })
    .countDocuments()
    .catch(errFinding => res.status(500).json({ error: errFinding }));

  if (isCategoryExists) {
    return res.status(409).json({
      message: 'Category is already created.',
    });
  }

  // create new category
  const categoryToCreate = new Category({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    photos: req.body.photos,
    active: req.body.active,
  });

  return categoryToCreate
    .save()
    .then(() =>
      res.status(201).json({
        message: 'New category is created successfully.',
        data: categoryToCreate,
      }),
    )
    .catch(errSaving => res.status(500).json({ error: errSaving }));
};

exports.delete = async (req, res) => {
  if (req.params.id) {
    const databaseQuery = { _id: req.params.id };

    const categories = await Category.deleteOne(databaseQuery).catch(
      errorDeleting => res.status(500).json({ error: errorDeleting }),
    );

    return res.status(200).json({
      data: categories,
      categoryId: databaseQuery,
    });
  }

  return res.status(400).json({
    message: 'Category was not found.',
  });
};

exports.update = async (req, res) => {
  const category = await Category.findById(req.params.id).catch(errFinding =>
    res.status(500).json({ error: errFinding }),
  );

  if (!category) {
    return res.status(404).json({
      message: "Category with given id wasn't found.",
    });
  }

  if (req.body.name === '') {
    delete req.body.name;
  }

  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }).catch(errUpdating => res.status(500).json({ error: errUpdating }));

  return res.status(200).json({
    message: 'Category has been updated.',
    data: updatedCategory,
  });
};
