import express from 'express';
import { authController } from '../controllers';
import * as validators from '../validators';

const router = express.Router();

router.post('/signUp', validators.auth.signUp, authController.signUp);
router.post('/signIn', validators.auth.signIn, authController.signIn);

module.exports = router;
