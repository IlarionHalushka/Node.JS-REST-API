import mongoose from 'mongoose';
import config from '../config/enviroment';

export const connection = mongoose.connect(
  config.mongo.uri,
  error => {
    if (error) {
      throw error;
    }
  },
);

export { default as User } from './User';
export { default as Category } from './Category';
export { default as Supplier } from './Supplier';
