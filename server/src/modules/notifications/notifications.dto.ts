import { NotificationType } from '@prisma/client';

/**
 * Notification Data Transfer Objects (DTOs)
 * Path: server/src/modules/notifications/notifications.dto.ts
 * Purpose: Request schemas for creating, querying, and filtering notifications.
 */

export interface CreateNotificationDto {
  title: string;
  message: string;
  type?: NotificationType;
  userId: string;
  entityType?: string;
  entityId?: string;
}

export interface NotificationQueryDto {
  page?: number | string;
  limit?: number | string;
  isRead?: boolean | string;
  type?: NotificationType | string;
  startDate?: string;
  endDate?: string;
  userId?: string;
}
