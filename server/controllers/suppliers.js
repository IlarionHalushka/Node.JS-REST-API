import { Supplier } from '../models';
import * as crudManager from './crudManager';

exports.get = async (req, res) => crudManager.get(req, res, Supplier, {});

exports.create = async (req, res) => {
  const allowDuplicates = false;
  crudManager.create(req, res, Supplier, allowDuplicates);
};

exports.delete = async (req, res) => crudManager.delete(req, res, Supplier, {});

exports.update = async (req, res) => crudManager.update(req, res, Supplier);
