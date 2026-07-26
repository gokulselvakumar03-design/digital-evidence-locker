/**
 * Admin Data Transfer Objects (DTOs)
 * Path: server/src/modules/admin/admin.dto.ts
 * Purpose: Request filters for audit trail queries.
 */

export interface AuditLogQueryDto {
  userId?: string;
  action?: string;
  entityName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
