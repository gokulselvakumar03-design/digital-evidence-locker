import { Router } from 'express';
import { getAuditLogsController } from './admin.controller.js';

/**
 * Admin Express Router Setup
 * Path: server/src/modules/admin/admin.routes.ts
 * Purpose: Express router definition under /api/v1/admin.
 */
const router = Router();

router.get('/audit-logs', getAuditLogsController);

export default router;
