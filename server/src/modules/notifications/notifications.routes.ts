import { Router } from 'express';
import {
  getUserNotificationsController,
  markNotificationReadController,
} from './notifications.controller.js';

/**
 * Notifications Express Router Setup
 * Path: server/src/modules/notifications/notifications.routes.ts
 * Purpose: Express router definition under /api/v1/notifications.
 */
const router = Router();

router.get('/', getUserNotificationsController);
router.patch('/:id/read', markNotificationReadController);

export default router;
