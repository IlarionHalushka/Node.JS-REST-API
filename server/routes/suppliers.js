import express from 'express';
import { authController, suppliersController } from '../controllers';
import * as validators from '../validators';
import { wrapAsyncError } from '../utils';

const router = express.Router();

router.get('/', authController.requireAdminLogin(), wrapAsyncError(suppliersController.get));

router.post(
  '/',
  authController.requireAdminLogin(),
  validators.suppliers.create,
  wrapAsyncError(suppliersController.create),
);

router.patch(
  '/:id',
  authController.requireAdminLogin(),
  validators.suppliers.update,
  wrapAsyncError(suppliersController.update),
);

router.delete(
  '/:id',
  authController.requireAdminLogin(),
  wrapAsyncError(suppliersController.delete),
);

module.exports = router;
