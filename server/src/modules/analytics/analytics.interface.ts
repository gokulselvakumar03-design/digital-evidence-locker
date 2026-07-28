/**
 * Analytics Module Interface Definitions
 * Path: server/src/modules/analytics/analytics.interface.ts
 * Purpose: Defines TypeScript interfaces for dashboard metrics and system statistics.
 */

export interface IDashboardSummary {
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  cases: {
    total: number;
    open: number;
    underInvestigation: number;
    closed: number;
    archived: number;
  };
  evidence: {
    total: number;
    verified: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  totalComments: number;
  totalAuditLogs: number;
}

export interface IGroupCount {
  name: string;
  count: number;
}

export interface ITopUserCount {
  userId: string;
  name: string;
  email: string;
  count: number;
}

export interface ICaseAnalytics {
  byStatus: IGroupCount[];
  byPriority: IGroupCount[];
  byCategory: IGroupCount[];
  monthlyCreated: IGroupCount[];
}

export interface IEvidenceAnalytics {
  byStatus: IGroupCount[];
  byFileType: IGroupCount[];
  monthlyUploads: IGroupCount[];
  averageFileSize: number;
  topUploaders: ITopUserCount[];
}

export interface IUserAnalytics {
  byRole: IGroupCount[];
  activeVsInactive: {
    active: number;
    inactive: number;
  };
  topInvestigators: ITopUserCount[];
  topLawyers: ITopUserCount[];
}

export interface IAuditAnalytics {
  byAction: IGroupCount[];
  byEntity: IGroupCount[];
  byUser: ITopUserCount[];
  dailyActivity: IGroupCount[];
  monthlyActivity: IGroupCount[];
}

export interface ISystemAnalytics {
  databaseStats: {
    totalUsers: number;
    totalCases: number;
    totalEvidence: number;
    totalComments: number;
    totalAuditLogs: number;
  };
  storageUsage: {
    totalBytes: number;
    formattedSize: string;
  };
  averages: {
    commentsPerCase: number;
    evidencePerCase: number;
    auditLogsPerCase: number;
  };
}
