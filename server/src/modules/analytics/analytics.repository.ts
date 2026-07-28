import prisma from '../../config/prisma.js';
import { Prisma, CaseStatus, EvidenceStatus, Role } from '@prisma/client';

/**
 * Analytics Data Access Repository
 * Path: server/src/modules/analytics/analytics.repository.ts
 * Purpose: Executes Prisma ORM count, groupBy, and aggregate queries across domain models. Zero raw SQL.
 */
export class AnalyticsRepository {
  /**
   * User counts (Total, Active, Inactive).
   */
  async getUserCounts(dateWhere: Prisma.UserWhereInput = {}) {
    const where: Prisma.UserWhereInput = { deletedAt: null, ...dateWhere };
    const [total, active, inactive] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.count({ where: { ...where, isActive: true } }),
      prisma.user.count({ where: { ...where, isActive: false } }),
    ]);
    return { total, active, inactive };
  }

  /**
   * Case counts (Total, Open, Under Investigation, Closed, Archived).
   */
  async getCaseCounts(baseWhere: Prisma.CaseWhereInput = {}) {
    const where: Prisma.CaseWhereInput = { deletedAt: null, ...baseWhere };
    const [total, open, underInvestigation, closed, archived] = await Promise.all([
      prisma.case.count({ where }),
      prisma.case.count({ where: { ...where, status: CaseStatus.OPEN } }),
      prisma.case.count({ where: { ...where, status: CaseStatus.UNDER_INVESTIGATION } }),
      prisma.case.count({ where: { ...where, status: CaseStatus.CLOSED } }),
      prisma.case.count({ where: { ...where, status: CaseStatus.ARCHIVED } }),
    ]);
    return { total, open, underInvestigation, closed, archived };
  }

  /**
   * Evidence counts (Total, Verified, Pending, Approved, Rejected).
   */
  async getEvidenceCounts(baseWhere: Prisma.EvidenceWhereInput = {}) {
    const where: Prisma.EvidenceWhereInput = { deletedAt: null, ...baseWhere };
    const [total, verified, pending, approved, rejected] = await Promise.all([
      prisma.evidence.count({ where }),
      prisma.evidence.count({ where: { ...where, status: EvidenceStatus.VERIFIED } }),
      prisma.evidence.count({ where: { ...where, status: EvidenceStatus.PENDING } }),
      prisma.evidence.count({ where: { ...where, status: EvidenceStatus.APPROVED } }),
      prisma.evidence.count({ where: { ...where, status: EvidenceStatus.REJECTED } }),
    ]);
    return { total, verified, pending, approved, rejected };
  }

  /**
   * Comment total count.
   */
  async getCommentCount(baseWhere: Prisma.CommentWhereInput = {}) {
    return prisma.comment.count({ where: { deletedAt: null, ...baseWhere } });
  }

  /**
   * Audit log total count.
   */
  async getAuditCount(baseWhere: Prisma.AuditLogWhereInput = {}) {
    return prisma.auditLog.count({ where: baseWhere });
  }

  /**
   * Case grouping metrics (by status, priority, category).
   */
  async getCasesGroupedByStatus(where: Prisma.CaseWhereInput = {}) {
    return prisma.case.groupBy({
      by: ['status'],
      where: { deletedAt: null, ...where },
      _count: { id: true },
    });
  }

  async getCasesGroupedByPriority(where: Prisma.CaseWhereInput = {}) {
    return prisma.case.groupBy({
      by: ['priority'],
      where: { deletedAt: null, ...where },
      _count: { id: true },
    });
  }

  async getCasesGroupedByCategory(where: Prisma.CaseWhereInput = {}) {
    return prisma.case.groupBy({
      by: ['category'],
      where: { deletedAt: null, ...where },
      _count: { id: true },
    });
  }

  /**
   * Fetch Case creation timestamps for monthly trends.
   */
  async getCaseCreationTimestamps(where: Prisma.CaseWhereInput = {}) {
    return prisma.case.findMany({
      where: { deletedAt: null, ...where },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Evidence grouping metrics (by status, fileType).
   */
  async getEvidenceGroupedByStatus(where: Prisma.EvidenceWhereInput = {}) {
    return prisma.evidence.groupBy({
      by: ['status'],
      where: { deletedAt: null, ...where },
      _count: { id: true },
    });
  }

  async getEvidenceGroupedByFileType(where: Prisma.EvidenceWhereInput = {}) {
    return prisma.evidence.groupBy({
      by: ['fileType'],
      where: { deletedAt: null, ...where },
      _count: { id: true },
    });
  }

  /**
   * Fetch Evidence upload timestamps for monthly trends.
   */
  async getEvidenceUploadTimestamps(where: Prisma.EvidenceWhereInput = {}) {
    return prisma.evidence.findMany({
      where: { deletedAt: null, ...where },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Evidence file size aggregation (_avg, _sum).
   */
  async getEvidenceFileSizeAggregation(where: Prisma.EvidenceWhereInput = {}) {
    return prisma.evidence.aggregate({
      where: { deletedAt: null, ...where },
      _avg: { fileSize: true },
      _sum: { fileSize: true },
    });
  }

  /**
   * Top evidence uploaders.
   */
  async getTopUploaders(where: Prisma.EvidenceWhereInput = {}, limit = 5) {
    const grouped = await prisma.evidence.groupBy({
      by: ['uploadedById'],
      where: { deletedAt: null, ...where },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    const userIds = grouped.map((g) => g.uploadedById);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, firstName: true, lastName: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    return grouped.map((g) => {
      const u = userMap.get(g.uploadedById);
      const displayName = u ? (u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email) : 'Unknown User';
      return {
        userId: g.uploadedById,
        name: displayName,
        email: u?.email || '',
        count: g._count.id,
      };
    });
  }

  /**
   * User grouping metrics (by role).
   */
  async getUsersGroupedByRole(where: Prisma.UserWhereInput = {}) {
    return prisma.user.groupBy({
      by: ['role'],
      where: { deletedAt: null, ...where },
      _count: { id: true },
    });
  }

  /**
   * Top Investigators (role = INVESTIGATOR, ordered by assigned/created cases count).
   */
  async getTopInvestigators(limit = 5) {
    const investigators = await prisma.user.findMany({
      where: { role: Role.INVESTIGATOR, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        firstName: true,
        lastName: true,
        _count: {
          select: {
            assignedCases: true,
            createdCases: true,
            uploadedEvidence: true,
          },
        },
      },
      take: limit,
    });

    return investigators.map((u) => ({
      userId: u.id,
      name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      email: u.email,
      count: u._count.assignedCases + u._count.createdCases + u._count.uploadedEvidence,
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Top Lawyers (role = LAWYER or LEGAL_COUNSEL).
   */
  async getTopLawyers(limit = 5) {
    const lawyers = await prisma.user.findMany({
      where: {
        role: { in: [Role.LAWYER, Role.LEGAL_COUNSEL] },
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        firstName: true,
        lastName: true,
        _count: {
          select: {
            assignedCases: true,
            comments: true,
          },
        },
      },
      take: limit,
    });

    return lawyers.map((u) => ({
      userId: u.id,
      name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      email: u.email,
      count: u._count.assignedCases + u._count.comments,
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Audit log grouping metrics (by action, entityType, performedById).
   */
  async getAuditGroupedByAction(where: Prisma.AuditLogWhereInput = {}) {
    return prisma.auditLog.groupBy({
      by: ['action'],
      where,
      _count: { id: true },
    });
  }

  async getAuditGroupedByEntity(where: Prisma.AuditLogWhereInput = {}) {
    return prisma.auditLog.groupBy({
      by: ['entityType'],
      where,
      _count: { id: true },
    });
  }

  async getAuditGroupedByUser(where: Prisma.AuditLogWhereInput = {}, limit = 5) {
    const grouped = await prisma.auditLog.groupBy({
      by: ['performedById'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    const userIds = grouped.map((g) => g.performedById);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, firstName: true, lastName: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    return grouped.map((g) => {
      const u = userMap.get(g.performedById);
      const displayName = u ? (u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email) : 'Unknown User';
      return {
        userId: g.performedById,
        name: displayName,
        email: u?.email || '',
        count: g._count.id,
      };
    });
  }

  /**
   * Fetch Audit log creation timestamps for daily/monthly trends.
   */
  async getAuditTimestamps(where: Prisma.AuditLogWhereInput = {}) {
    return prisma.auditLog.findMany({
      where,
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}

export const analyticsRepository = new AnalyticsRepository();
