import { EvidenceStatus } from '@prisma/client';

/**
 * Evidence Data Transfer Objects (DTOs)
 * Path: server/src/modules/evidence/evidence.dto.ts
 * Purpose: Strongly typed request payload definitions for evidence uploading, updating, status modification, and filtering.
 */

export interface CreateEvidenceDto {
  title: string;
  description?: string;
  caseId: string;
  tags?: string[] | string;
}

export interface UpdateEvidenceDto {
  title?: string;
  description?: string;
  tags?: string[] | string;
  remarks?: string;
}

export interface UpdateEvidenceStatusDto {
  status: EvidenceStatus;
}

export interface EvidenceQueryDto {
  page?: number | string;
  limit?: number | string;
  search?: string;
  caseId?: string;
  status?: EvidenceStatus | string;
  fileType?: string;
  uploaderId?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}
