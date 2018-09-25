import { Category } from '../models';
import * as crudManager from './crudManager';

exports.get = async (req, res) => {
  const databaseQuery = {};

  if (
    req.query.includeInactive === undefined ||
    req.query.includeInactive === 'false'
  ) {
    databaseQuery.active = true;
  }

  return crudManager.get(req, res, Category, databaseQuery);
};

exports.show = async (req, res) => crudManager.show(req, res, Category);

exports.create = async (req, res) => {
  const allowDupicates = false;
  return crudManager.create(req, res, Category, allowDupicates);
};

exports.delete = async (req, res) => crudManager.delete(req, res, Category, {});

exports.update = async (req, res) => crudManager.update(req, res, Category);
