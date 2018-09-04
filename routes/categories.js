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

module.exports = router;
