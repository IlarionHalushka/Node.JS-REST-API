import express from 'express';
import { authController } from '../controllers';
import * as validators from '../validators';
import { wrapAsyncError } from '../utils';

const router = express.Router();

router.post(
  '/signUp',
  validators.auth.signUp,
  wrapAsyncError(authController.signUp),
);
router.post(
  '/signIn',
  validators.auth.signIn,
  wrapAsyncError(authController.signIn),
);

module.exports = router;
