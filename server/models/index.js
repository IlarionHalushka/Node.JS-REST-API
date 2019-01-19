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

export { User } from './User';
export { Category } from './Category';
export { Supplier } from './Supplier';
