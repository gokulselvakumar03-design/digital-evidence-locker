/**
 * Comments Module Interface Definitions
 * Path: server/src/modules/comments/comments.interface.ts
 * Purpose: Defines interfaces for case and evidence discussion comments.
 */

export interface IComment {
  id: string;
  caseId: string;
  evidenceId?: string | null;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
