import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { notificationService } from './notifications.service.js';

/**
 * Notifications HTTP Request Controller
 * Path: server/src/modules/notifications/notifications.controller.ts
 * Purpose: Express request controller for user notifications management.
 */

export const getAllNotificationsController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await notificationService.getNotifications(req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Notifications retrieved successfully'));
});

export const getUnreadNotificationsController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await notificationService.getUnreadNotifications(req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Unread notifications retrieved successfully'));
});

export const getUnreadCountController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await notificationService.getUnreadCount(req.user);
  res.status(200).json(new ApiResponse(200, result, 'Unread notification count retrieved successfully'));
});

export const getNotificationByIdController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const notification = await notificationService.getNotificationById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, notification, 'Notification details retrieved successfully'));
});

export const markReadController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await notificationService.markNotificationAsRead(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Notification marked as read'));
});

export const markAllReadController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await notificationService.markAllNotificationsAsRead(req.user);
  res.status(200).json(new ApiResponse(200, result, 'All notifications marked as read'));
});

export const deleteNotificationController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await notificationService.deleteNotification(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Notification deleted successfully'));
});
