import { Router } from 'express';
import {
  registerController,
  loginController,
  getProfileController,
  logoutController,
} from './auth.controller.js';
import { registerValidation, loginValidation } from './auth.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

/**
 * Authentication Express Router Setup
 * Path: server/src/modules/auth/auth.routes.ts
 * Purpose: Connects validation middlewares, auth middlewares, and controllers for authentication endpoints.
 */
const router = Router();

// Public Authentication Routes
router.post('/register', registerValidation, registerController);
router.post('/login', loginValidation, loginController);
router.post('/logout', logoutController);

// Protected Profile Routes
router.get('/profile', authenticate, getProfileController);
router.get('/me', authenticate, getProfileController);

export default router;
