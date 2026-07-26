/**
 * Analytics Data Transfer Objects (DTOs)
 * Path: server/src/modules/analytics/analytics.dto.ts
 * Purpose: DTO contract for analytics query date ranges.
 */

export interface AnalyticsQueryDto {
  startDate?: string;
  endDate?: string;
}
