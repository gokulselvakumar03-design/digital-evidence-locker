import { AuditAction } from '@prisma/client';

/**
 * Audit Logs Data Transfer Objects (DTOs)
 * Path: server/src/modules/audit/audit.dto.ts
 * Purpose: Request payloads for creating audit records and querying audit history.
 */

export interface CreateAuditLogDto {
  action: AuditAction;
  entityType: string;
  entityId: string;
  description: string;
  performedById: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  oldValue?: any;
  newValue?: any;
}

export interface AuditLogQueryDto {
  page?: number | string;
  limit?: number | string;
  search?: string;
  sort?: string;
  startDate?: string;
  endDate?: string;
  action?: AuditAction | string;
  entityType?: string;
  performedBy?: string;
  userId?: string;
}
