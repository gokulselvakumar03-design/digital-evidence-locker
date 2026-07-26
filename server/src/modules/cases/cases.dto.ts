/**
 * Case Data Transfer Objects (DTOs)
 * Path: server/src/modules/cases/cases.dto.ts
 * Purpose: Request payloads for case creation, membership assignment, and filtering.
 */

export interface CreateCaseDto {
  caseNumber: string;
  title: string;
  description?: string;
  priority?: string;
}

export interface AddCaseMemberDto {
  userId: string;
  assignedRole?: string;
}

export interface CaseQueryDto {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}
