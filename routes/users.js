import express from 'express';
import UsersController from '../controllers/users';
import * as validators from '../validators';

const router = express.Router();

router.post('/signup', validators.auth.signup, UsersController.signup);

module.exports = router;
