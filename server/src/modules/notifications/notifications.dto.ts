/**
 * Notifications Data Transfer Objects (DTOs)
 * Path: server/src/modules/notifications/notifications.dto.ts
 * Purpose: Request payloads for creating and updating notifications.
 */

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
}
