/**
 * Notifications Module Interface Definitions
 * Path: server/src/modules/notifications/notifications.interface.ts
 * Purpose: Defines interfaces for user alert notifications.
 */

export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
