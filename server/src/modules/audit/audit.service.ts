import { CreateAuditLogDto, AuditLogQueryDto } from './audit.dto.js';
import { auditRepository } from './audit.repository.js';
import { ApiError } from '../../utils/apiError.js';
import { IJwtPayload } from '../../utils/jwt.helper.js';
import prisma from '../../config/prisma.js';

/**
 * Audit Logs Business Logic Service
 * Path: server/src/modules/audit/audit.service.ts
 * Purpose: Enforces immutable chain of custody audit logging and RBAC filtering for system activities.
 */
export class AuditService {
  /**
   * Helper method to create an audit log entry automatically from anywhere in the codebase.
   */
  async createLog(dto: CreateAuditLogDto) {
    try {
      return await auditRepository.createAuditLog(dto);
    } catch (error: any) {
      // Log error internally so audit failures do not break main operations
      console.error('Failed to write audit log:', error?.message || error);
      return null;
    }
  }

  /**
   * Retrieves paginated audit logs with search, sorting, and RBAC filters.
   */
  async getAllLogs(query: AuditLogQueryDto, user: IJwtPayload) {
    const userAccessFilter = await this.buildUserAccessFilter(user);

    const { logs, total, page, limit, totalPages } = await auditRepository.findAll(query, userAccessFilter);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Retrieves a single audit log entry by ID with RBAC verification.
   */
  async getLogById(id: string, user: IJwtPayload) {
    if (user.role === 'VIEWER') {
      throw new ApiError(403, 'Forbidden: VIEWER role does not have access to audit logs');
    }

    const log = await auditRepository.findById(id);
    if (!log) {
      throw new ApiError(404, 'Audit log record not found');
    }

    // Verify access if user has scoped role
    if (user.role === 'INVESTIGATOR' || user.role === 'LAWYER') {
      const isSelfAction = log.performedById === user.userId;
      if (!isSelfAction) {
        // Verify if entity belongs to accessible cases
        const accessibleCaseIds = await this.getAccessibleCaseIds(user);
        const isAccessibleEntity = accessibleCaseIds.includes(log.entityId);
        if (!isAccessibleEntity) {
          throw new ApiError(403, 'Forbidden: You do not have permission to view this audit log entry');
        }
      }
    }

    return log;
  }

  /**
   * Retrieves audit logs for a specific user ID.
   */
  async getLogsByUser(targetUserId: string, query: AuditLogQueryDto, user: IJwtPayload) {
    const userAccessFilter = await this.buildUserAccessFilter(user);

    const { logs, total, page, limit, totalPages } = await auditRepository.findByUser(targetUserId, query, userAccessFilter);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Retrieves audit logs for a specific entity type and entity ID.
   */
  async getLogsByEntity(entityType: string, entityId: string, query: AuditLogQueryDto, user: IJwtPayload) {
    const userAccessFilter = await this.buildUserAccessFilter(user);

    const { logs, total, page, limit, totalPages } = await auditRepository.findByEntity(entityType, entityId, query, userAccessFilter);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Builds RBAC query filter based on user role.
   */
  private async buildUserAccessFilter(user: IJwtPayload): Promise<any> {
    if (user.role === 'VIEWER') {
      throw new ApiError(403, 'Forbidden: VIEWER role does not have access to audit logs');
    }

    if (user.role === 'ADMIN' || user.role === 'AUDITOR') {
      // ADMIN & AUDITOR have full system-wide access to all audit logs
      return {};
    }

    // INVESTIGATOR / LAWYER: View logs performed by self OR related to accessible cases/evidence
    const accessibleCaseIds = await this.getAccessibleCaseIds(user);

    return {
      OR: [
        { performedById: user.userId },
        { entityId: { in: accessibleCaseIds } },
      ],
    };
  }

  /**
   * Helper to retrieve array of Case IDs accessible by current user.
   */
  private async getAccessibleCaseIds(user: IJwtPayload): Promise<string[]> {
    const cases = await prisma.case.findMany({
      where: {
        deletedAt: null,
        OR: [
          { createdById: user.userId },
          { assignedToId: user.userId },
        ],
      },
      select: { id: true },
    });

    return cases.map((c) => c.id);
  }
}

export const auditService = new AuditService();
