import { AnalyticsQueryDto } from './analytics.dto.js';
import { analyticsRepository } from './analytics.repository.js';
import {
  IDashboardSummary,
  ICaseAnalytics,
  IEvidenceAnalytics,
  IUserAnalytics,
  IAuditAnalytics,
  ISystemAnalytics,
} from './analytics.interface.js';
import { ApiError } from '../../utils/apiError.js';
import { IJwtPayload } from '../../utils/jwt.helper.js';
import { Prisma } from '@prisma/client';

/**
 * Analytics Business Logic Service
 * Path: server/src/modules/analytics/analytics.service.ts
 * Purpose: Generates dynamic analytics and statistics on-the-fly. Zero persistent analytics data stored.
 */
export class AnalyticsService {
  /**
   * 1. GET /api/v1/analytics/dashboard
   */
  async getDashboardSummary(query: AnalyticsQueryDto, user: IJwtPayload): Promise<IDashboardSummary> {
    const { caseWhere, evidenceWhere, auditWhere, userWhere } = this.buildWhereFilters(query, user);

    const [userCounts, caseCounts, evidenceCounts, totalComments, totalAuditLogs] = await Promise.all([
      analyticsRepository.getUserCounts(userWhere),
      analyticsRepository.getCaseCounts(caseWhere),
      analyticsRepository.getEvidenceCounts(evidenceWhere),
      analyticsRepository.getCommentCount(caseWhere.id ? { caseId: caseWhere.id as string } : {}),
      analyticsRepository.getAuditCount(auditWhere),
    ]);

    return {
      users: userCounts,
      cases: caseCounts,
      evidence: evidenceCounts,
      totalComments,
      totalAuditLogs,
    };
  }

  /**
   * 2. GET /api/v1/analytics/cases
   */
  async getCaseAnalytics(query: AnalyticsQueryDto, user: IJwtPayload): Promise<ICaseAnalytics> {
    const { caseWhere } = this.buildWhereFilters(query, user);

    const [rawStatus, rawPriority, rawCategory, timestamps] = await Promise.all([
      analyticsRepository.getCasesGroupedByStatus(caseWhere),
      analyticsRepository.getCasesGroupedByPriority(caseWhere),
      analyticsRepository.getCasesGroupedByCategory(caseWhere),
      analyticsRepository.getCaseCreationTimestamps(caseWhere),
    ]);

    return {
      byStatus: rawStatus.map((g) => ({ name: g.status, count: g._count.id })),
      byPriority: rawPriority.map((g) => ({ name: g.priority, count: g._count.id })),
      byCategory: rawCategory.map((g) => ({ name: g.category || 'UNCATEGORIZED', count: g._count.id })),
      monthlyCreated: this.formatMonthlyTrend(timestamps),
    };
  }

  /**
   * 3. GET /api/v1/analytics/evidence
   */
  async getEvidenceAnalytics(query: AnalyticsQueryDto, user: IJwtPayload): Promise<IEvidenceAnalytics> {
    const { evidenceWhere } = this.buildWhereFilters(query, user);

    const [rawStatus, rawFileType, timestamps, agg, topUploaders] = await Promise.all([
      analyticsRepository.getEvidenceGroupedByStatus(evidenceWhere),
      analyticsRepository.getEvidenceGroupedByFileType(evidenceWhere),
      analyticsRepository.getEvidenceUploadTimestamps(evidenceWhere),
      analyticsRepository.getEvidenceFileSizeAggregation(evidenceWhere),
      analyticsRepository.getTopUploaders(evidenceWhere, 5),
    ]);

    const averageFileSize = Math.round(agg._avg.fileSize || 0);

    return {
      byStatus: rawStatus.map((g) => ({ name: g.status, count: g._count.id })),
      byFileType: rawFileType.map((g) => ({ name: g.fileType, count: g._count.id })),
      monthlyUploads: this.formatMonthlyTrend(timestamps),
      averageFileSize,
      topUploaders,
    };
  }

  /**
   * 4. GET /api/v1/analytics/users
   */
  async getUserAnalytics(query: AnalyticsQueryDto, user: IJwtPayload): Promise<IUserAnalytics> {
    const { userWhere } = this.buildWhereFilters(query, user);

    const [rawRole, counts, topInvestigators, topLawyers] = await Promise.all([
      analyticsRepository.getUsersGroupedByRole(userWhere),
      analyticsRepository.getUserCounts(userWhere),
      analyticsRepository.getTopInvestigators(5),
      analyticsRepository.getTopLawyers(5),
    ]);

    return {
      byRole: rawRole.map((g) => ({ name: g.role, count: g._count.id })),
      activeVsInactive: {
        active: counts.active,
        inactive: counts.inactive,
      },
      topInvestigators,
      topLawyers,
    };
  }

  /**
   * 5. GET /api/v1/analytics/audit
   */
  async getAuditAnalytics(query: AnalyticsQueryDto, user: IJwtPayload): Promise<IAuditAnalytics> {
    const { auditWhere } = this.buildWhereFilters(query, user);

    const [rawAction, rawEntity, topUsers, timestamps] = await Promise.all([
      analyticsRepository.getAuditGroupedByAction(auditWhere),
      analyticsRepository.getAuditGroupedByEntity(auditWhere),
      analyticsRepository.getAuditGroupedByUser(auditWhere, 5),
      analyticsRepository.getAuditTimestamps(auditWhere),
    ]);

    return {
      byAction: rawAction.map((g) => ({ name: g.action, count: g._count.id })),
      byEntity: rawEntity.map((g) => ({ name: g.entityType, count: g._count.id })),
      byUser: topUsers,
      dailyActivity: this.formatDailyTrend(timestamps),
      monthlyActivity: this.formatMonthlyTrend(timestamps),
    };
  }

  /**
   * 6. GET /api/v1/analytics/system
   */
  async getSystemAnalytics(query: AnalyticsQueryDto, user: IJwtPayload): Promise<ISystemAnalytics> {
    const { caseWhere, evidenceWhere, userWhere } = this.buildWhereFilters(query, user);

    const [userCounts, caseCounts, evidenceCounts, commentCount, auditCount, sizeAgg] = await Promise.all([
      analyticsRepository.getUserCounts(userWhere),
      analyticsRepository.getCaseCounts(caseWhere),
      analyticsRepository.getEvidenceCounts(evidenceWhere),
      analyticsRepository.getCommentCount(),
      analyticsRepository.getAuditCount(),
      analyticsRepository.getEvidenceFileSizeAggregation(evidenceWhere),
    ]);

    const totalCases = caseCounts.total || 1; // Avoid divide by zero
    const totalBytes = Number(sizeAgg._sum.fileSize || 0);

    return {
      databaseStats: {
        totalUsers: userCounts.total,
        totalCases: caseCounts.total,
        totalEvidence: evidenceCounts.total,
        totalComments: commentCount,
        totalAuditLogs: auditCount,
      },
      storageUsage: {
        totalBytes,
        formattedSize: this.formatBytes(totalBytes),
      },
      averages: {
        commentsPerCase: Number((commentCount / totalCases).toFixed(2)),
        evidencePerCase: Number((evidenceCounts.total / totalCases).toFixed(2)),
        auditLogsPerCase: Number((auditCount / totalCases).toFixed(2)),
      },
    };
  }

  /**
   * Helper to build RBAC and Date filter clauses for Prisma queries.
   */
  private buildWhereFilters(query: AnalyticsQueryDto, user: IJwtPayload) {
    if (user.role === 'VIEWER') {
      throw new ApiError(403, 'Forbidden: VIEWER role does not have access to analytics');
    }

    const dateClause: any = {};
    if (query.startDate || query.endDate) {
      if (query.startDate) dateClause.gte = new Date(query.startDate);
      if (query.endDate) dateClause.lte = new Date(query.endDate);
    }

    const caseWhere: Prisma.CaseWhereInput = {};
    const evidenceWhere: Prisma.EvidenceWhereInput = {};
    const auditWhere: Prisma.AuditLogWhereInput = {};
    const userWhere: Prisma.UserWhereInput = {};

    if (Object.keys(dateClause).length > 0) {
      caseWhere.createdAt = dateClause;
      evidenceWhere.createdAt = dateClause;
      auditWhere.createdAt = dateClause;
      userWhere.createdAt = dateClause;
    }

    if (query.status) {
      caseWhere.status = query.status as any;
      evidenceWhere.status = query.status as any;
    }

    if (query.priority) {
      caseWhere.priority = query.priority as any;
    }

    if (query.category) {
      caseWhere.category = query.category;
    }

    if (query.role) {
      userWhere.role = query.role as any;
    }

    // Role-based scope restrictions
    if (user.role === 'INVESTIGATOR' || user.role === 'LAWYER') {
      caseWhere.OR = [
        { createdById: user.userId },
        { assignedToId: user.userId },
      ];
      evidenceWhere.OR = [
        { uploadedById: user.userId },
        { case: { assignedToId: user.userId } },
        { case: { createdById: user.userId } },
      ];
      auditWhere.performedById = user.userId;
    }

    return { caseWhere, evidenceWhere, auditWhere, userWhere };
  }

  /**
   * Helper to format timestamps into monthly buckets (YYYY-MM).
   */
  private formatMonthlyTrend(records: { createdAt: Date }[]) {
    const countsMap = new Map<string, number>();
    for (const r of records) {
      const monthStr = new Date(r.createdAt).toISOString().slice(0, 7); // 'YYYY-MM'
      countsMap.set(monthStr, (countsMap.get(monthStr) || 0) + 1);
    }
    return Array.from(countsMap.entries()).map(([name, count]) => ({ name, count }));
  }

  /**
   * Helper to format timestamps into daily buckets (YYYY-MM-DD).
   */
  private formatDailyTrend(records: { createdAt: Date }[]) {
    const countsMap = new Map<string, number>();
    for (const r of records) {
      const dateStr = new Date(r.createdAt).toISOString().slice(0, 10); // 'YYYY-MM-DD'
      countsMap.set(dateStr, (countsMap.get(dateStr) || 0) + 1);
    }
    return Array.from(countsMap.entries()).map(([name, count]) => ({ name, count }));
  }

  /**
   * Helper to format raw bytes into human readable string.
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const analyticsService = new AnalyticsService();
