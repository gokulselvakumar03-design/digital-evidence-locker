import { Router } from 'express';
import {
  getAllUsersController,
  getUserByIdController,
  updateUserController,
} from './users.controller.js';

/**
 * Users Express Router Setup
 * Path: server/src/modules/users/users.routes.ts
 * Purpose: Express router definition under /api/v1/users.
 */
const router = Router();

router.get('/', getAllUsersController);
router.get('/:id', getUserByIdController);
router.patch('/:id', updateUserController);

export default router;
