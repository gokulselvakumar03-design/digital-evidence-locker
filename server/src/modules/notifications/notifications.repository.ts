import prisma from '../../config/prisma.js';
import { CreateNotificationDto, NotificationQueryDto } from './notifications.dto.js';
import { NotificationType, Prisma } from '@prisma/client';

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
};

/**
 * Notification Data Access Repository
 * Path: server/src/modules/notifications/notifications.repository.ts
 * Purpose: Executes Prisma queries for Notification entity persistence, status updates, and count aggregations.
 */
export class NotificationRepository {
  /**
   * Persists a new notification in the database.
   */
  async createNotification(input: CreateNotificationDto) {
    return prisma.notification.create({
      data: {
        title: input.title,
        message: input.message,
        type: input.type || NotificationType.SYSTEM,
        userId: input.userId,
        entityType: input.entityType || null,
        entityId: input.entityId || null,
        isRead: false,
      },
      include: {
        user: { select: userSelect },
      },
    });
  }

  /**
   * Finds a single notification record by ID.
   */
  async findNotificationById(id: string) {
    return prisma.notification.findUnique({
      where: { id },
      include: {
        user: { select: userSelect },
      },
    });
  }

  /**
   * Retrieves paginated, filtered notifications for a specific user or system-wide (ADMIN).
   */
  async findNotificationsByUser(targetUserId?: string, query: NotificationQueryDto = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    const whereClause: Prisma.NotificationWhereInput = {};

    if (targetUserId) {
      whereClause.userId = targetUserId;
    }

    if (query.isRead !== undefined) {
      if (typeof query.isRead === 'boolean') {
        whereClause.isRead = query.isRead;
      } else if (typeof query.isRead === 'string') {
        whereClause.isRead = query.isRead.toLowerCase() === 'true';
      }
    }

    if (query.type && Object.values(NotificationType).includes(query.type as NotificationType)) {
      whereClause.type = query.type as NotificationType;
    }

    if (query.startDate || query.endDate) {
      whereClause.createdAt = {};
      if (query.startDate) {
        whereClause.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        whereClause.createdAt.lte = new Date(query.endDate);
      }
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: userSelect },
        },
      }),
      prisma.notification.count({ where: whereClause }),
      targetUserId ? prisma.notification.count({ where: { userId: targetUserId, isRead: false } }) : 0,
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { notifications, total, unreadCount, page, limit, totalPages };
  }

  /**
   * Retrieves paginated unread notifications for a specific user.
   */
  async findUnreadNotificationsByUser(userId: string, query: NotificationQueryDto = {}) {
    return this.findNotificationsByUser(userId, {
      ...query,
      isRead: false,
    });
  }

  /**
   * Counts unread notifications for a user.
   */
  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Marks a specific notification as read and sets readAt timestamp.
   */
  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
      include: {
        user: { select: userSelect },
      },
    });
  }

  /**
   * Marks all notifications for a specific user as read.
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Deletes a notification record.
   */
  async deleteNotification(id: string) {
    return prisma.notification.delete({
      where: { id },
    });
  }

  /**
   * Deletes notifications older than specified number of days.
   */
  async deleteOldNotifications(days: number, userId?: string) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const whereClause: Prisma.NotificationWhereInput = {
      createdAt: { lte: cutoffDate },
    };

    if (userId) {
      whereClause.userId = userId;
    }

    return prisma.notification.deleteMany({
      where: whereClause,
    });
  }
}

export const notificationRepository = new NotificationRepository();
