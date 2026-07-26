import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { notificationService } from './notifications.service.js';

/**
 * Notifications HTTP Request Controller
 * Path: server/src/modules/notifications/notifications.controller.ts
 * Purpose: Express request handler for user notifications.
 */

export const getUserNotificationsController = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const list = await notificationService.getUserNotifications('stub_user_id');
  res.status(200).json(new ApiResponse(200, list, 'Notifications retrieved successfully'));
});

export const markNotificationReadController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await notificationService.markAsRead(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Notification marked as read'));
});
