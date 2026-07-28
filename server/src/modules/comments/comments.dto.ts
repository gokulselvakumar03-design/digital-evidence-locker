/**
 * Comments Data Transfer Objects (DTOs)
 * Path: server/src/modules/comments/comments.dto.ts
 * Purpose: Request payloads for creating, updating, and querying comments.
 */

export interface CreateCommentDto {
  content: string;
  caseId?: string;
  evidenceId?: string;
  parentCommentId?: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentQueryDto {
  page?: number | string;
  limit?: number | string;
  search?: string;
}
