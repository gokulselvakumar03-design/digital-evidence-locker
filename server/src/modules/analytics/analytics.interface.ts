/**
 * Analytics Module Interface Definitions
 * Path: server/src/modules/analytics/analytics.interface.ts
 * Purpose: Defines interfaces for dashboard metrics and system audit analytics.
 */

export interface IDashboardStats {
  totalCases: number;
  totalEvidence: number;
  tamperAttempts: number;
  activeInvestigators: number;
}
