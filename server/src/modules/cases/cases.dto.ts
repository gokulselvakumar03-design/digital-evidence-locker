/**
 * Case Data Transfer Objects (DTOs)
 * Path: server/src/modules/cases/cases.dto.ts
 * Purpose: Request payloads for case creation, updates, status changes, and queries.
 */

export interface CreateCaseDto {
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  assignedToId?: string;
}

export interface UpdateCaseDto {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  assignedToId?: string;
}

export interface UpdateCaseStatusDto {
  status: string;
}

export interface AssignCaseDto {
  assignedToId: string;
}

export interface CaseQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  assignedToId?: string;
  sort?: 'createdAt_desc' | 'createdAt_asc' | 'priority_desc' | 'priority_asc' | 'asc' | 'desc';
}
