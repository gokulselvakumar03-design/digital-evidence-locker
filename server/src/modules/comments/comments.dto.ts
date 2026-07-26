/**
 * Comments Data Transfer Objects (DTOs)
 * Path: server/src/modules/comments/comments.dto.ts
 * Purpose: Request schemas for creating and querying comments.
 */

export interface CreateCommentDto {
  caseId: string;
  evidenceId?: string;
  content: string;
}
