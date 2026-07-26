/**
 * Case Module Interface Definitions
 * Path: server/src/modules/cases/cases.interface.ts
 * Purpose: Domain interface contracts for Case entities.
 */

export interface ICaseUserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ICaseDetail {
  id: string;
  caseNumber: string;
  title: string;
  description?: string | null;
  category: string;
  status: string;
  priority: string;
  createdById: string;
  assignedToId?: string | null;
  createdBy?: ICaseUserSummary;
  assignedTo?: ICaseUserSummary | null;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface IPaginatedCasesResponse {
  cases: ICaseDetail[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
