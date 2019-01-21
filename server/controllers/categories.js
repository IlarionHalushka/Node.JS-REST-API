import { Category } from '../models';
import * as crudManager from './crudManager';

export const get = async (req, res) => {
  const databaseQuery = {};
  // by default return active === true
  if (req.query.includeInactive === undefined || req.query.includeInactive === 'false') {
    databaseQuery.active = true;
  }

  return crudManager.get(req, res, Category, databaseQuery);
};

export const show = async (req, res) => crudManager.show(req, res, Category);

export const create = async (req, res) => crudManager.create(req, res, Category, false);

export const remove = async (req, res) => crudManager.remove(req, res, Category, {});

export const update = async (req, res) => crudManager.update(req, res, Category);
