import prisma from '../../config/prisma.js';
import { CommentQueryDto } from './comments.dto.js';
import { Prisma } from '@prisma/client';

export interface ICreateCommentRepoInput {
  content: string;
  userId: string;
  caseId?: string | null;
  evidenceId?: string | null;
  parentCommentId?: string | null;
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  firstName: true,
  lastName: true,
};

/**
 * Comments Data Access Repository
 * Path: server/src/modules/comments/comments.repository.ts
 * Purpose: Executes Prisma queries for Comment entity persistence with soft delete and threaded replies support.
 */
export class CommentRepository {
  /**
   * Persists a new comment or reply in the database.
   */
  async createComment(input: ICreateCommentRepoInput) {
    return prisma.comment.create({
      data: {
        content: input.content,
        userId: input.userId,
        caseId: input.caseId || null,
        evidenceId: input.evidenceId || null,
        parentCommentId: input.parentCommentId || null,
        isEdited: false,
      },
      include: {
        user: { select: userSelect },
      },
    });
  }

  /**
   * Finds a non-deleted comment by ID with author and replies details.
   */
  async findCommentById(id: string) {
    return prisma.comment.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: { select: userSelect },
        replies: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: userSelect },
          },
        },
      },
    });
  }

  /**
   * Retrieves paginated top-level comments and nested replies attached to a Case.
   */
  async findCommentsByCase(caseId: string, query: CommentQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    const whereClause: Prisma.CommentWhereInput = {
      caseId,
      parentCommentId: null,
      deletedAt: null,
    };

    if (query.search) {
      whereClause.content = {
        contains: query.search.trim(),
        mode: 'insensitive',
      };
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: userSelect },
          replies: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'asc' },
            include: {
              user: { select: userSelect },
              replies: {
                where: { deletedAt: null },
                orderBy: { createdAt: 'asc' },
                include: {
                  user: { select: userSelect },
                },
              },
            },
          },
        },
      }),
      prisma.comment.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { comments, total, page, limit, totalPages };
  }

  /**
   * Retrieves paginated top-level comments and nested replies attached to an Evidence.
   */
  async findCommentsByEvidence(evidenceId: string, query: CommentQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    const whereClause: Prisma.CommentWhereInput = {
      evidenceId,
      parentCommentId: null,
      deletedAt: null,
    };

    if (query.search) {
      whereClause.content = {
        contains: query.search.trim(),
        mode: 'insensitive',
      };
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: userSelect },
          replies: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'asc' },
            include: {
              user: { select: userSelect },
              replies: {
                where: { deletedAt: null },
                orderBy: { createdAt: 'asc' },
                include: {
                  user: { select: userSelect },
                },
              },
            },
          },
        },
      }),
      prisma.comment.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { comments, total, page, limit, totalPages };
  }

  /**
   * Updates comment content and marks isEdited = true.
   */
  async updateComment(id: string, content: string) {
    return prisma.comment.update({
      where: { id },
      data: {
        content,
        isEdited: true,
      },
      include: {
        user: { select: userSelect },
      },
    });
  }

  /**
   * Soft deletes a comment record by setting deletedAt timestamp.
   */
  async deleteComment(id: string) {
    return prisma.comment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Retrieves direct non-deleted replies for a given parent comment ID.
   */
  async findReplies(parentCommentId: string) {
    return prisma.comment.findMany({
      where: {
        parentCommentId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: userSelect },
      },
    });
  }
}

export const commentRepository = new CommentRepository();
