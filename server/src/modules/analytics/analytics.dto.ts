/**
 * Analytics Data Transfer Objects (DTOs)
 * Path: server/src/modules/analytics/analytics.dto.ts
 * Purpose: Strongly typed request payload definitions for analytics query filtering.
 */

export interface AnalyticsQueryDto {
  startDate?: string;
  endDate?: string;
  role?: string;
  status?: string;
  category?: string;
  priority?: string;
}
