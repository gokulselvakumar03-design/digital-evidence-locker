import { INotification } from './notifications.interface.js';

/**
 * Notifications Business Logic Service
 * Path: server/src/modules/notifications/notifications.service.ts
 * Purpose: Business logic for dispatching user notifications.
 */
export class NotificationService {
  async getUserNotifications(_userId: string): Promise<INotification[]> {
    // Developer Stub: Get user notifications
    return [];
  }

  async markAsRead(_id: string): Promise<void> {
    // Developer Stub: Update notification read status
  }
}

export const notificationService = new NotificationService();
