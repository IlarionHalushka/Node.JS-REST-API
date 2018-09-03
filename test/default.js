global.chai = require('chai');
global.supertest = require('supertest');
global.expect = require('chai').expect;
global.api = require('supertest')('http://localhost:3000');
global.mongoose = require('mongoose');
global.config = require('./../config/enviroment');
global.routes = require('./common/routes');
global.testHelpers = require('./common/testHelpers');

process.env.NODE_ENV = 'development';

global.connection = global.mongoose.createConnection(config.mongo.uri);

before(async () => {
  connection.on('error', console.error.bind(console, 'connection error:'));

  await connection.once('open', async () => {
    await connection.db.collection('users', async (err, collection) => {
      await collection.find({});
    });
  });
});
