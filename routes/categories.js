import express from 'express';
import { authController, categoriesController } from '../controllers';
import * as validators from '../validators';

const router = express.Router();

router.get('/:id', categoriesController.show);

router.get('/', categoriesController.get);

router.post(
  '/',
  authController.requireAdminLogin(),
  validators.categories.create,
  categoriesController.create,
);

router.patch('/:id', validators.categories.update, categoriesController.update);

router.delete(
  '/:id',
  authController.requireAdminLogin(),
  categoriesController.delete,
);

module.exports = router;
