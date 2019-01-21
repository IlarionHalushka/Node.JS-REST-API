import { Supplier } from '../models';
import * as crudManager from './crudManager';

export const get = async (req, res) => crudManager.get(req, res, Supplier, {});

export const create = async (req, res) => crudManager.create(req, res, Supplier, false);

export const remove = async (req, res) => crudManager.remove(req, res, Supplier, {});

export const update = async (req, res) => crudManager.update(req, res, Supplier);
