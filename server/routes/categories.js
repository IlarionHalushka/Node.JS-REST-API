import express from 'express';
import { authController, categoriesController } from '../controllers';
import * as validators from '../validators';
import { wrapAsyncError } from '../utils';

const router = express.Router();

router.get('/:id', wrapAsyncError(categoriesController.show));

router.get('/', wrapAsyncError(categoriesController.get));

router.post(
  '/',
  authController.requireAdminLogin(),
  validators.categories.create,
  wrapAsyncError(categoriesController.create),
);

router.patch(
  '/:id',
  authController.requireAdminLogin(),
  validators.categories.update,
  wrapAsyncError(categoriesController.update),
);

router.delete(
  '/:id',
  authController.requireAdminLogin(),
  wrapAsyncError(categoriesController.delete),
);

module.exports = router;
