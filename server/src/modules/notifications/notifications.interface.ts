import { NotificationType } from '@prisma/client';

/**
 * Notification Module Interface Definitions
 * Path: server/src/modules/notifications/notifications.interface.ts
 * Purpose: Defines TypeScript interfaces for Notification model, pagination, and unread counts.
 */

export interface INotificationUser {
  id: string;
  name?: string;
  email: string;
  role: string;
}

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
  isRead: boolean;
  readAt: Date | null;
  entityType: string | null;
  entityId: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: INotificationUser;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginatedNotifications {
  notifications: INotification[];
  unreadCount: number;
  pagination: IPaginationMeta;
}
