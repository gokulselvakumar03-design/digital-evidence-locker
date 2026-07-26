import { CreateCommentDto } from './comments.dto.js';

/**
 * Comments Data Access Repository
 * Path: server/src/modules/comments/comments.repository.ts
 * Purpose: Executes Prisma queries for Comment entity persistence.
 */
export class CommentRepository {
  async createComment(_dto: CreateCommentDto, _authorId: string): Promise<any> {
    // Developer Stub: Execute prisma.comment.create(...)
    return null;
  }

  async findByCaseId(_caseId: string): Promise<any[]> {
    // Developer Stub: Execute prisma.comment.findMany({ where: { caseId } })
    return [];
  }
}

export const commentRepository = new CommentRepository();
