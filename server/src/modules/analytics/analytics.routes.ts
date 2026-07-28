import { Router } from 'express';
import {
  getDashboardSummaryController,
  getCaseAnalyticsController,
  getEvidenceAnalyticsController,
  getUserAnalyticsController,
  getAuditAnalyticsController,
  getSystemAnalyticsController,
} from './analytics.controller.js';
import { analyticsQueryValidation } from './analytics.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';

/**
 * Analytics Express Router Setup
 * Path: server/src/modules/analytics/analytics.routes.ts
 * Purpose: Route definitions for dashboard metrics and system statistics under /api/v1/analytics.
 */
const router = Router();

const allowedRoles = ['ADMIN', 'AUDITOR', 'INVESTIGATOR', 'LAWYER'];

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Get top-level dashboard summary metrics
 * @access  Private (ADMIN, AUDITOR, INVESTIGATOR, LAWYER)
 */
router.get(
  '/dashboard',
  authenticate,
  authorizeRoles(...allowedRoles),
  analyticsQueryValidation,
  getDashboardSummaryController
);

/**
 * @route   GET /api/v1/analytics/cases
 * @desc    Get case analytics grouped by status, priority, category, and monthly created trend
 * @access  Private (ADMIN, AUDITOR, INVESTIGATOR, LAWYER)
 */
router.get(
  '/cases',
  authenticate,
  authorizeRoles(...allowedRoles),
  analyticsQueryValidation,
  getCaseAnalyticsController
);

/**
 * @route   GET /api/v1/analytics/evidence
 * @desc    Get evidence analytics grouped by status, fileType, monthly uploads, avg size, and top uploaders
 * @access  Private (ADMIN, AUDITOR, INVESTIGATOR, LAWYER)
 */
router.get(
  '/evidence',
  authenticate,
  authorizeRoles(...allowedRoles),
  analyticsQueryValidation,
  getEvidenceAnalyticsController
);

/**
 * @route   GET /api/v1/analytics/users
 * @desc    Get user analytics grouped by role, active/inactive counts, top investigators and lawyers
 * @access  Private (ADMIN, AUDITOR, INVESTIGATOR, LAWYER)
 */
router.get(
  '/users',
  authenticate,
  authorizeRoles(...allowedRoles),
  analyticsQueryValidation,
  getUserAnalyticsController
);

/**
 * @route   GET /api/v1/analytics/audit
 * @desc    Get audit log analytics grouped by action, entity, user, daily and monthly activity
 * @access  Private (ADMIN, AUDITOR, INVESTIGATOR, LAWYER)
 */
router.get(
  '/audit',
  authenticate,
  authorizeRoles(...allowedRoles),
  analyticsQueryValidation,
  getAuditAnalyticsController
);

/**
 * @route   GET /api/v1/analytics/system
 * @desc    Get system health, storage usage, and average metrics per case
 * @access  Private (ADMIN, AUDITOR, INVESTIGATOR, LAWYER)
 */
router.get(
  '/system',
  authenticate,
  authorizeRoles(...allowedRoles),
  analyticsQueryValidation,
  getSystemAnalyticsController
);

export default router;
