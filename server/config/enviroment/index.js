import development from './development';
import test from './test';
import production from './production';

let environmentPath;

switch (process.env.NODE_ENV) {
  case 'development':
    environmentPath = development;
    break;
  case 'test':
    environmentPath = test;
    break;
  case 'production':
    environmentPath = production;
    break;
  default:
    environmentPath = development;
}

module.exports = environmentPath;
