import { escapeRegexSpecialChars } from '../utils';
import { codes } from '../constants';

exports.get = async (req, res, Model, databaseQuery) => {
  if (req.query.name) {
    escapeRegexSpecialChars(req.query.name);

    databaseQuery.name = new RegExp(`${req.query.name}`, 'i');
  }

  const documents = await Model.find(databaseQuery, Model.publicFields);

  return res.status(codes.SUCCESS).json({
    data: documents,
  });
};

exports.delete = async (req, res, Model, databaseQuery) => {
  if (req.params.id) {
    databaseQuery = { _id: req.params.id };

    const documents = await Model.deleteOne(databaseQuery);

    return res.status(codes.SUCCESS).json({
      data: documents,
      documentId: databaseQuery,
    });
  }

  return res.status(codes.NOT_FOUND).json({
    message: `${Model.modelName} was not found.`,
  });
};

exports.show = async (req, res, Model) => {
  const databaseQuery = { _id: req.params.id };

  const document = await Model.findOne(databaseQuery, Model.publicFields);

  return res.status(codes.SUCCESS).json({
    data: document,
  });
};

exports.update = async (req, res, Model) => {
  const document = await Model.findById(req.params.id);

  if (!document) {
    return res.status(codes.NOT_FOUND).json({
      message: `${Model.modelName} with given id wasn't found.`,
    });
  }

  if (req.body.name === '') {
    delete req.body.name;
  }

  req.body.updatedBy = req.user._id;

  const updateddocument = await Model.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  });

  return res.status(codes.SUCCESS).json({
    message: `${Model.modelName} has been updated.`,
    data: updateddocument,
  });
};

exports.create = async (req, res, Model, allowDuplicates = false) => {
  // check for duplicates by 'name' field
  if (!allowDuplicates) {
    const isDocumentExists = await Model.findOne({ name: req.body.name });

    if (isDocumentExists) {
      return res.status(codes.CONFLICT).json({
        message: `${Model.modelName} is already created.`,
      });
    }
  }

  // create new document
  const documentToCreate = {
    ...req.body,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  };

  await Model.create(documentToCreate);

  return res.status(codes.CREATED).json({
    message: `New ${Model.modelName} is created successfully.`,
    data: documentToCreate,
  });
};
