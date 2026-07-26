/**
 * Admin Module Interface Definitions
 * Path: server/src/modules/admin/admin.interface.ts
 * Purpose: Defines interfaces for audit logs and system administration tasks.
 */

export interface IAuditLog {
  id: string;
  userId?: string | null;
  action: string;
  entityName: string;
  entityId: string;
  details?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
  timestamp: Date;
}
