import { AnalysisType, AnalysisStatus } from '@prisma/client';

/**
 * AI Module Data Transfer Objects (DTOs)
 * Path: server/src/modules/ai/ai.dto.ts
 * Purpose: Request payload schemas for AI analysis requests, semantic search, and querying history.
 */

export interface AnalyzeEvidenceDto {
  evidenceId: string;
  analysisType?: AnalysisType;
  query?: string;
  options?: any;
}

export interface SemanticSearchDto {
  query: string;
  caseId?: string;
  evidenceId?: string;
}

export interface AIQueryDto {
  page?: number | string;
  limit?: number | string;
  evidenceId?: string;
  analysisType?: AnalysisType | string;
  status?: AnalysisStatus | string;
  sort?: string;
}
