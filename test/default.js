global.chai = require('chai');
global.supertest = require('supertest');
global.expect = require('chai').expect;
const server = require('../server/app');
global.api = require('supertest')(server);
global.mongoose = require('mongoose');
global.config = require('../server/config/enviroment');
global.routes = require('./common/routes');
global.testHelpers = require('./common/testHelpers');
global.constants = require('./../server/constants');

global.connection = global.mongoose.createConnection(config.mongo.uri);

before(async () => {
  connection.on('error', console.error.bind(console, 'connection error:')); // es-lint-disable-line

  await connection.once('open', async () => {
    await connection.db.collection('users', async (err, collection) => {
      try {
        await collection.findOne({});
      } catch (e) {
        console.error(e); // es-lint-disable-line
        throw e;
      }
    });
  });
});
