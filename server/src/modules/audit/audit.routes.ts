import { Router } from 'express';
import {
  getAllLogsController,
  getLogByIdController,
  getLogsByUserController,
  getLogsByEntityController,
} from './audit.controller.js';
import {
  auditQueryValidation,
  auditIdParamValidation,
  userParamValidation,
  entityParamsValidation,
} from './audit.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';

/**
 * Audit Logs Express Router Setup
 * Path: server/src/modules/audit/audit.routes.ts
 * Purpose: Route mapping for audit log querying endpoints under /api/v1/audit.
 */
const router = Router();

/**
 * @route   GET /api/v1/audit
 * @desc    Get all audit log entries with pagination, search, sort, and date/action filters
 * @access  Private (ADMIN, AUDITOR, INVESTIGATOR, LAWYER)
 */
router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'AUDITOR', 'INVESTIGATOR', 'LAWYER'),
  auditQueryValidation,
  getAllLogsController
);

/**
 * @route   GET /api/v1/audit/:id
 * @desc    Get audit log details by ID
 * @access  Private (ADMIN, AUDITOR, INVESTIGATOR, LAWYER)
 */
router.get(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'AUDITOR', 'INVESTIGATOR', 'LAWYER'),
  auditIdParamValidation,
  getLogByIdController
);

/**
 * @route   GET /api/v1/audit/user/:userId
 * @desc    Get audit logs performed by a specific user
 * @access  Private (ADMIN, AUDITOR, INVESTIGATOR, LAWYER)
 */
router.get(
  '/user/:userId',
  authenticate,
  authorizeRoles('ADMIN', 'AUDITOR', 'INVESTIGATOR', 'LAWYER'),
  userParamValidation,
  auditQueryValidation,
  getLogsByUserController
);

/**
 * @route   GET /api/v1/audit/entity/:entityType/:entityId
 * @desc    Get audit logs for a specific entity
 * @access  Private (ADMIN, AUDITOR, INVESTIGATOR, LAWYER)
 */
router.get(
  '/entity/:entityType/:entityId',
  authenticate,
  authorizeRoles('ADMIN', 'AUDITOR', 'INVESTIGATOR', 'LAWYER'),
  entityParamsValidation,
  auditQueryValidation,
  getLogsByEntityController
);

export default router;
