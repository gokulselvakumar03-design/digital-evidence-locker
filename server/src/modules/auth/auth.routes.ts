import { Router } from 'express';
import {
  registerController,
  loginController,
  logoutController,
  getMeController,
} from './auth.controller.js';

/**
 * Authentication Express Router Setup
 * Path: server/src/modules/auth/auth.routes.ts
 * Purpose: Registers routes for auth operations under /api/v1/auth.
 */
const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/me', getMeController);

export default router;
