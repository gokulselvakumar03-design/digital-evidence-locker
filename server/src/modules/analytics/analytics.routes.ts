import { Router } from 'express';
import { getDashboardStatsController } from './analytics.controller.js';

/**
 * Analytics Express Router Setup
 * Path: server/src/modules/analytics/analytics.routes.ts
 * Purpose: Express router definition under /api/v1/analytics.
 */
const router = Router();

router.get('/dashboard', getDashboardStatsController);

export default router;
