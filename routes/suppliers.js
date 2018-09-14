import express from 'express';
import { authController, suppliersController } from '../controllers';
import * as validators from '../validators';

const router = express.Router();

router.get('/', authController.requireAdminLogin(), suppliersController.get);

router.post(
  '/',
  authController.requireAdminLogin(),
  validators.suppliers.create,
  suppliersController.create,
);

router.patch(
  '/:id',
  authController.requireAdminLogin(),
  validators.suppliers.update,
  suppliersController.update,
);

router.delete(
  '/:id',
  authController.requireAdminLogin(),
  suppliersController.delete,
);

module.exports = router;
