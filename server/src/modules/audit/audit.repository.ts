import prisma from '../../config/prisma.js';
import { CreateAuditLogDto, AuditLogQueryDto } from './audit.dto.js';
import { AuditAction, Prisma } from '@prisma/client';

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  firstName: true,
  lastName: true,
};

/**
 * Audit Logs Data Access Repository
 * Path: server/src/modules/audit/audit.repository.ts
 * Purpose: Executes Prisma queries for immutable AuditLog entities. Only INSERT and SELECT allowed.
 */
export class AuditRepository {
  /**
   * Persists an immutable audit log record.
   */
  async createAuditLog(input: CreateAuditLogDto) {
    return prisma.auditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        description: input.description,
        performedById: input.performedById,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
        oldValue: input.oldValue !== undefined ? input.oldValue : Prisma.JsonNull,
        newValue: input.newValue !== undefined ? input.newValue : Prisma.JsonNull,
      },
      include: {
        performedBy: { select: userSelect },
      },
    });
  }

  /**
   * Finds a single audit log record by unique ID.
   */
  async findById(id: string) {
    return prisma.auditLog.findUnique({
      where: { id },
      include: {
        performedBy: { select: userSelect },
      },
    });
  }

  /**
   * Retrieves paginated, searchable, and filtered audit log entries.
   */
  async findAll(query: AuditLogQueryDto, userAccessFilter: Prisma.AuditLogWhereInput = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    const whereClause: Prisma.AuditLogWhereInput = {
      ...userAccessFilter,
    };

    if (query.action && Object.values(AuditAction).includes(query.action as AuditAction)) {
      whereClause.action = query.action as AuditAction;
    }

    if (query.entityType) {
      whereClause.entityType = { equals: query.entityType.trim(), mode: 'insensitive' };
    }

    const targetUserId = query.performedBy || query.userId;
    if (targetUserId) {
      whereClause.performedById = targetUserId;
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

    if (query.search) {
      const searchStr = query.search.trim();
      whereClause.AND = [
        {
          OR: [
            { description: { contains: searchStr, mode: 'insensitive' } },
            { entityId: { contains: searchStr, mode: 'insensitive' } },
            { entityType: { contains: searchStr, mode: 'insensitive' } },
            { ipAddress: { contains: searchStr, mode: 'insensitive' } },
            { userAgent: { contains: searchStr, mode: 'insensitive' } },
          ],
        },
      ];
    }

    let orderBy: Prisma.AuditLogOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sort === 'createdAt_asc' || query.sort === 'asc') {
      orderBy = { createdAt: 'asc' };
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: {
          performedBy: { select: userSelect },
        },
      }),
      prisma.auditLog.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { logs, total, page, limit, totalPages };
  }

  /**
   * Retrieves audit logs for a specific entity type and entity ID.
   */
  async findByEntity(entityType: string, entityId: string, query: AuditLogQueryDto, userAccessFilter: Prisma.AuditLogWhereInput = {}) {
    return this.findAll(
      {
        ...query,
        entityType,
      },
      {
        ...userAccessFilter,
        entityId,
      }
    );
  }

  /**
   * Retrieves audit logs performed by a specific user.
   */
  async findByUser(performedById: string, query: AuditLogQueryDto, userAccessFilter: Prisma.AuditLogWhereInput = {}) {
    return this.findAll(query, {
      ...userAccessFilter,
      performedById,
    });
  }
}

export const auditRepository = new AuditRepository();
