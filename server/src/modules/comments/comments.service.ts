import { CreateCommentDto } from './comments.dto.js';
import { IComment } from './comments.interface.js';

/**
 * Comments Business Logic Service
 * Path: server/src/modules/comments/comments.service.ts
 * Purpose: Case discussion & evidence annotation management.
 */
export class CommentService {
  async addComment(_dto: CreateCommentDto, _authorId: string): Promise<IComment> {
    // Developer Stub: Add comment to case/evidence
    return {} as IComment;
  }

  async getCommentsByCase(_caseId: string): Promise<IComment[]> {
    // Developer Stub: Retrieve comments attached to case
    return [];
  }
}

export const commentService = new CommentService();
