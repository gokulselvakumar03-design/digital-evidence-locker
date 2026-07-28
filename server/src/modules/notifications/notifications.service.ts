import { CreateNotificationDto, NotificationQueryDto } from './notifications.dto.js';
import { notificationRepository } from './notifications.repository.js';
import { ApiError } from '../../utils/apiError.js';
import { IJwtPayload } from '../../utils/jwt.helper.js';
import { auditService } from '../audit/audit.service.js';
import { AuditAction } from '@prisma/client';

/**
 * Notification Business Logic Service
 * Path: server/src/modules/notifications/notifications.service.ts
 * Purpose: Manages user notifications, status toggles, audit logs, and automatic event notifications.
 */
export class NotificationService {
  /**
   * Helper method to create a notification automatically.
   */
  async createNotification(dto: CreateNotificationDto) {
    try {
      if (!dto.userId) return null;
      return await notificationRepository.createNotification(dto);
    } catch (error: any) {
      console.error('Failed to create notification:', error?.message || error);
      return null;
    }
  }

  /**
   * Retrieves paginated notifications with filters.
   */
  async getNotifications(query: NotificationQueryDto, user: IJwtPayload) {
    // ADMIN can filter by any user or view system-wide; non-ADMIN can only view their own
    const targetUserId = user.role === 'ADMIN' ? (query.userId || undefined) : user.userId;

    const { notifications, total, unreadCount, page, limit, totalPages } =
      await notificationRepository.findNotificationsByUser(targetUserId, query);

    return {
      notifications,
      unreadCount,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Retrieves paginated unread notifications for current user.
   */
  async getUnreadNotifications(query: NotificationQueryDto, user: IJwtPayload) {
    return this.getNotifications({ ...query, isRead: false }, user);
  }

  /**
   * Gets total count of unread notifications for current user.
   */
  async getUnreadCount(user: IJwtPayload) {
    const unreadCount = await notificationRepository.getUnreadCount(user.userId);
    return { unreadCount };
  }

  /**
   * Retrieves single notification by ID with access check.
   */
  async getNotificationById(id: string, user: IJwtPayload) {
    const notification = await notificationRepository.findNotificationById(id);
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    if (user.role !== 'ADMIN' && notification.userId !== user.userId) {
      throw new ApiError(403, 'Forbidden: You can only view your own notifications');
    }

    return notification;
  }

  /**
   * Marks a specific notification as read and logs audit event.
   */
  async markNotificationAsRead(id: string, user: IJwtPayload) {
    const notification = await notificationRepository.findNotificationById(id);
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    if (user.role !== 'ADMIN' && notification.userId !== user.userId) {
      throw new ApiError(403, 'Forbidden: You can only update your own notifications');
    }

    const updated = await notificationRepository.markAsRead(id);

    // Audit log: Notification Read
    await auditService.createLog({
      action: AuditAction.CHANGE_CASE_STATUS,
      entityType: 'NOTIFICATION',
      entityId: id,
      description: `Notification marked as read: '${notification.title}'`,
      performedById: user.userId,
    });

    return updated;
  }

  /**
   * Marks all notifications for current user as read.
   */
  async markAllNotificationsAsRead(user: IJwtPayload) {
    await notificationRepository.markAllAsRead(user.userId);
    return { message: 'All notifications marked as read' };
  }

  /**
   * Deletes a notification and logs audit event.
   */
  async deleteNotification(id: string, user: IJwtPayload) {
    const notification = await notificationRepository.findNotificationById(id);
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    if (user.role !== 'ADMIN' && notification.userId !== user.userId) {
      throw new ApiError(403, 'Forbidden: You can only delete your own notifications');
    }

    const deleted = await notificationRepository.deleteNotification(id);

    // Audit log: Notification Deleted
    await auditService.createLog({
      action: AuditAction.DELETE_CASE,
      entityType: 'NOTIFICATION',
      entityId: id,
      description: `Notification deleted: '${notification.title}'`,
      performedById: user.userId,
    });

    return deleted;
  }

  /**
   * Deletes notifications older than specified number of days.
   */
  async deleteOldNotifications(days = 30, user: IJwtPayload) {
    const targetUserId = user.role === 'ADMIN' ? undefined : user.userId;
    const result = await notificationRepository.deleteOldNotifications(days, targetUserId);
    return { deletedCount: result.count };
  }
}

export const notificationService = new NotificationService();
