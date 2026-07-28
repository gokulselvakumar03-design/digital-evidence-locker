import { AnalysisType, AnalysisStatus } from '@prisma/client';

/**
 * AI Module Interface Definitions
 * Path: server/src/modules/ai/ai.interface.ts
 * Purpose: Defines interfaces for AI analysis entity models, request payloads, and pagination results.
 */

export interface IAIUser {
  id: string;
  name?: string;
  email: string;
  role: string;
}

export interface IAIEvidence {
  id: string;
  title: string;
  fileType: string;
  storageUrl: string;
  caseId: string;
}

export interface IAIAnalysis {
  id: string;
  evidenceId: string;
  analysisType: AnalysisType;
  status: AnalysisStatus;
  requestId: string | null;
  result: any | null;
  summary: string | null;
  confidence: number | null;
  processingTime: number | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  evidence?: IAIEvidence;
  createdBy?: IAIUser;
}

export interface IPaginatedAIAnalyses {
  analyses: IAIAnalysis[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
