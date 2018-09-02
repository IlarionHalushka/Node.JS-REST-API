import mongoose from 'mongoose';
import config from '../config/enviroment';

mongoose.Promise = Promise;

export const connection = mongoose.connect(
  config.mongo.uri,
  error => {
    if (error) {
      throw error;
    }
  },
);

// export { default as Category } from './Category';
// export { default as Activity } from './Activity';
export { default as User } from './User';
