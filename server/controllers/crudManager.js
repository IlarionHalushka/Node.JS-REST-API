import { escapeRegexSpecialChars } from '../utils';
import { CODES, MESSAGES } from '../constants';

export const get = async (req, res, Model, databaseQuery) => {
  if (req.query.name) {
    escapeRegexSpecialChars(req.query.name);

    databaseQuery.name = new RegExp(`${req.query.name}`, 'i');
  }

  const documents = await Model.find(databaseQuery, Model.publicFields);

  return res.status(CODES.SUCCESS).json({
    data: documents,
  });
};

export const remove = async (req, res, Model, databaseQuery) => {
  if (req.params.id) {
    databaseQuery = { _id: req.params.id };

    const documents = await Model.deleteOne(databaseQuery);

    return res.status(CODES.SUCCESS).json({
      data: documents,
      documentId: databaseQuery,
    });
  }

  return res.status(CODES.NOT_FOUND).json({
    message: `${Model.modelName}_${MESSAGES.NOT_FOUND}`,
  });
};

export const show = async (req, res, Model) => {
  const databaseQuery = { _id: req.params.id };

  const document = await Model.findOne(databaseQuery, Model.publicFields);

  return res.status(CODES.SUCCESS).json({
    data: document,
  });
};

export const update = async (req, res, Model) => {
  const document = await Model.findById(req.params.id);

  if (!document) {
    return res.status(CODES.NOT_FOUND).json({
      message: `${Model.modelName}_${MESSAGES.NOT_FOUND}`,
    });
  }

  if (req.body.name === '') {
    delete req.body.name;
  }

  req.body.updatedBy = req.user._id;

  const updatedDocument = await Model.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  });

  return res.status(CODES.SUCCESS).json({
    message: `${Model.modelName}_${MESSAGES.UPDATED}`,
    data: updatedDocument,
  });
};

export const create = async (req, res, Model, allowDuplicates = false) => {
  // check for duplicates by 'name' field
  if (!allowDuplicates) {
    const isDocumentExists = await Model.findOne({ name: req.body.name });

    if (isDocumentExists) {
      return res.status(CODES.CONFLICT).json({
        message: `${Model.modelName}_${MESSAGES.ALREADY_EXISTS}`,
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

  return res.status(CODES.CREATED).json({
    message: `${Model.modelName}_${MESSAGES.CREATED}`,
    data: documentToCreate,
  });
};
