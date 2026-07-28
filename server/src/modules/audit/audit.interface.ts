import { AuditAction } from '@prisma/client';

/**
 * Audit Logs Module Interface Definitions
 * Path: server/src/modules/audit/audit.interface.ts
 * Purpose: Defines interfaces for immutable audit log records and pagination envelopes.
 */

export interface IAuditUser {
  id: string;
  name?: string;
  email: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface IAuditLog {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  description: string;
  performedById: string;
  ipAddress: string | null;
  userAgent: string | null;
  oldValue: any | null;
  newValue: any | null;
  createdAt: Date;

  // Relations
  performedBy?: IAuditUser;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginatedAuditLogs {
  logs: IAuditLog[];
  pagination: IPaginationMeta;
}
