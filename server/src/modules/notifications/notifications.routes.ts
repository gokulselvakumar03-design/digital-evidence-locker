import { Router } from 'express';
import {
  getAllNotificationsController,
  getUnreadNotificationsController,
  getUnreadCountController,
  getNotificationByIdController,
  markReadController,
  markAllReadController,
  deleteNotificationController,
} from './notifications.controller.js';
import {
  notificationQueryValidation,
  notificationIdParamValidation,
} from './notifications.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

/**
 * Notifications Express Router Setup
 * Path: server/src/modules/notifications/notifications.routes.ts
 * Purpose: Route mapping for user notification feeds, read toggles, and count queries under /api/v1/notifications.
 */
const router = Router();

/**
 * @route   GET /api/v1/notifications/unread/count
 * @desc    Get total unread notification count for authenticated user
 * @access  Private (All Authenticated Users)
 */
router.get(
  '/unread/count',
  authenticate,
  getUnreadCountController
);

/**
 * @route   GET /api/v1/notifications/unread
 * @desc    Get paginated unread notifications for authenticated user
 * @access  Private (All Authenticated Users)
 */
router.get(
  '/unread',
  authenticate,
  notificationQueryValidation,
  getUnreadNotificationsController
);

/**
 * @route   PATCH /api/v1/notifications/read-all
 * @desc    Mark all notifications for authenticated user as read
 * @access  Private (All Authenticated Users)
 */
router.patch(
  '/read-all',
  authenticate,
  markAllReadController
);

/**
 * @route   GET /api/v1/notifications
 * @desc    Get paginated notifications with filters
 * @access  Private (All Authenticated Users)
 */
router.get(
  '/',
  authenticate,
  notificationQueryValidation,
  getAllNotificationsController
);

/**
 * @route   GET /api/v1/notifications/:id
 * @desc    Get single notification details
 * @access  Private (All Authenticated Users)
 */
router.get(
  '/:id',
  authenticate,
  notificationIdParamValidation,
  getNotificationByIdController
);

/**
 * @route   PATCH /api/v1/notifications/:id/read
 * @desc    Mark single notification as read
 * @access  Private (All Authenticated Users)
 */
router.patch(
  '/:id/read',
  authenticate,
  notificationIdParamValidation,
  markReadController
);

/**
 * @route   DELETE /api/v1/notifications/:id
 * @desc    Delete single notification
 * @access  Private (All Authenticated Users)
 */
router.delete(
  '/:id',
  authenticate,
  notificationIdParamValidation,
  deleteNotificationController
);

export default router;
