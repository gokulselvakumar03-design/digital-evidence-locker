import { Router } from 'express';
import { getAuditLogsController } from './admin.controller.js';

import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';

/**
 * Admin Express Router Setup
 * Path: server/src/modules/admin/admin.routes.ts
 * Purpose: Express router definition under /api/v1/admin.
 */
const router = Router();

router.get('/audit-logs', authenticate, authorizeRoles('ADMIN'), getAuditLogsController);

export default router;
