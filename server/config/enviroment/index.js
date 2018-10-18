import development from './development';
import test from './test';

let environmentPath;

switch (process.env.NODE_ENV) {
  case 'development':
    environmentPath = development;
    break;
  case 'test':
    environmentPath = test;
    break;
  default:
    environmentPath = development;
}

module.exports = environmentPath;
