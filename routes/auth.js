import express from 'express';
import AuthController from '../controllers/auth';
import * as validators from '../validators';

const router = express.Router();

router.post('/signUp', validators.auth.signUp, AuthController.signUp);

router.post('/signIn', validators.auth.signIn, AuthController.signIn);

module.exports = router;
