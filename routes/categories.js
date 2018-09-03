import express from 'express';
import CategoriesController from '../controllers/categories';
import * as validators from '../validators';

const router = express.Router();

router.post('/', validators.categories.create, CategoriesController.create);

module.exports = router;
