import mongoose from 'mongoose';

import { Supplier } from '../models';
import { escapeRegexSpecialChars } from '../utils';

exports.get = async (req, res) => {
  const databaseQuery = {};

  if (req.query.name) {
    escapeRegexSpecialChars(req.query.name);

    databaseQuery.name = new RegExp(`${req.query.name}`, 'i');
  }

  const suppliers = await Supplier.find(
    databaseQuery,
    Supplier.publicFields,
  ).catch(errFinding => res.status(500).json({ error: errFinding }));

  return res.status(200).json({
    data: suppliers,
  });
};

exports.create = async (req, res) => {
  // check for already registered supplier name
  const isSupplierExists = await Supplier.find({ name: req.body.name })
    .countDocuments()
    .catch(errFinding => res.status(500).json({ error: errFinding }));

  if (isSupplierExists) {
    return res.status(409).json({
      message: 'Supplier is already created.',
    });
  }

  // create new supplier
  const supplierToCreate = new Supplier({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    photos: req.body.photos,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  return supplierToCreate
    .save()
    .then(() =>
      res.status(201).json({
        message: 'New supplier is created successfully.',
      }),
    )
    .catch(errSaving => res.status(500).json({ error: errSaving }));
};

exports.delete = async (req, res) => {
  if (req.params.id) {
    const databaseQuery = { _id: req.params.id };

    const suppliers = await Supplier.deleteOne(databaseQuery).catch(
      errorDeleting => res.status(500).json({ error: errorDeleting }),
    );

    return res.status(200).json({
      data: suppliers,
      supplierId: databaseQuery,
    });
  }

  return res.status(400).json({
    message: 'Supplier was not found.',
  });
};

exports.update = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id).catch(errFinding =>
    res.status(500).json({ error: errFinding }),
  );

  if (!supplier) {
    return res.status(404).json({
      message: "Supplier with given id wasn't found.",
    });
  }

  if (req.body.name === '') {
    delete req.body.name;
  }

  req.body.updatedBy = req.user._id;

  const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }).catch(errUpdating => res.status(500).json({ error: errUpdating }));

  return res.status(200).json({
    message: 'Supplier has been updated.',
    data: updatedSupplier,
  });
};
