import { escapeRegexSpecialChars } from '../utils';
import { CODES, MESSAGES } from '../constants';

export const get = async (req, res, Model, databaseQuery) => {
  // escape special chars in name field
  if (req.query.name) {
    escapeRegexSpecialChars(req.query.name);
    databaseQuery.name = new RegExp(`${req.query.name}`, 'i');
  }
  // find in db and return documents
  const documents = await Model.find(databaseQuery, Model.publicFields);

  return res.status(CODES.SUCCESS).json({
    data: documents,
  });
};

export const remove = async (req, res, Model, databaseQuery) => {
  // if id was specified
  if (req.params.id) {
    databaseQuery = { _id: req.params.id };

    const documents = await Model.deleteOne(databaseQuery);

    return res.status(CODES.SUCCESS).json({
      data: documents,
      documentId: databaseQuery,
    });
  }
  // if id wasn't specified
  return res.status(CODES.NOT_FOUND).json({
    message: `${Model.modelName}_${MESSAGES.NOT_FOUND}`,
  });
};

export const show = async (req, res, Model) => {
  let databaseQuery = {};

  // if id was specified find document by id
  if (req.params.id) {
    databaseQuery = { _id: req.params.id };
  }

  const document = await Model.findOne(databaseQuery, Model.publicFields);
  // if document was found in db return SUCCESS
  if (document) {
    return res.status(CODES.SUCCESS).json({
      data: document,
    });
  }

  // if document was not found in db return NOT_FOUND
  return res.status(CODES.NOT_FOUND).json({
    message: `${Model.modelName}_${MESSAGES.NOT_FOUND}`,
  });
};

export const update = async (req, res, Model) => {
  // if id wasn't specified return NOT_FOUND
  if (!req.params.id) {
    return res.status(CODES.NOT_FOUND).json({
      message: `${Model.modelName}_${MESSAGES.NOT_FOUND}`,
    });
  }

  const document = await Model.findById(req.params.id);
  // if document was not found in db return NOT_FOUND
  if (!document) {
    return res.status(CODES.NOT_FOUND).json({
      message: `${Model.modelName}_${MESSAGES.NOT_FOUND}`,
    });
  }

  // don't update name to empty string
  if (req.body.name === '') {
    delete req.body.name;
  }
  // set updatedBY
  req.body.updatedBy = req.user._id;

  // update document and return SUCCESS
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

  // create new document and return SUCCESS
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
