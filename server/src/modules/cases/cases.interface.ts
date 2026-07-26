/**
 * Cases Module Interface Definitions
 * Path: server/src/modules/cases/cases.interface.ts
 * Purpose: Defines core domain interface models for Case entities.
 */

export interface ICase {
  id: string;
  caseNumber: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}
