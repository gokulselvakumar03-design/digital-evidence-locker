import { Router } from 'express';
import {
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  updateStatusController,
} from './users.controller.js';
import {
  userIdParamValidation,
  updateUserValidation,
  updateStatusValidation,
} from './users.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';

/**
 * Users Express Router Setup
 * Path: server/src/modules/users/users.routes.ts
 * Purpose: Route mapping for user management APIs under /api/v1/users and /api/users.
 */
const router = Router();

// 1. GET /api/v1/users (ADMIN only)
router.get('/', authenticate, authorizeRoles('ADMIN'), getAllUsersController);

// 2. GET /api/v1/users/:id (ADMIN or self)
router.get('/:id', authenticate, userIdParamValidation, getUserByIdController);

// 3. PUT /api/v1/users/:id (ADMIN or self; role change ADMIN only)
router.put('/:id', authenticate, updateUserValidation, updateUserController);

// 4. DELETE /api/v1/users/:id (Soft delete, ADMIN only)
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), userIdParamValidation, deleteUserController);

// 5. PATCH /api/v1/users/:id/status (Activate/deactivate user, ADMIN only)
router.patch('/:id/status', authenticate, authorizeRoles('ADMIN'), updateStatusValidation, updateStatusController);

export default router;
