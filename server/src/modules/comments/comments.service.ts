import { CreateCommentDto, UpdateCommentDto, CommentQueryDto } from './comments.dto.js';
import { commentRepository } from './comments.repository.js';
import { ApiError } from '../../utils/apiError.js';
import { IJwtPayload } from '../../utils/jwt.helper.js';
import { AuditAction, NotificationType } from '@prisma/client';
import { auditService } from '../audit/audit.service.js';
import { notificationService } from '../notifications/notifications.service.js';
import prisma from '../../config/prisma.js';

/**
 * Comments Business Logic Service
 * Path: server/src/modules/comments/comments.service.ts
 * Purpose: Case discussion & evidence annotation management with security controls and threaded replies.
 */
export class CommentService {
  /**
   * Creates a new top-level comment or nested reply.
   */
  async createComment(dto: CreateCommentDto, user: IJwtPayload) {
    // 1. Role authorization: ADMIN, INVESTIGATOR, LAWYER can create comments
    const allowedRoles = ['ADMIN', 'INVESTIGATOR', 'LAWYER'];
    if (!allowedRoles.includes(user.role)) {
      throw new ApiError(403, 'Forbidden: VIEWER role is read-only and cannot post comments');
    }

    let targetCaseId = dto.caseId || null;
    let targetEvidenceId = dto.evidenceId || null;

    let targetUserIdToNotify: string | null = null;

    // 2. Validate parent comment if nested reply
    if (dto.parentCommentId) {
      const parentComment = await commentRepository.findCommentById(dto.parentCommentId);
      if (!parentComment) {
        throw new ApiError(404, 'Parent comment not found or has been deleted');
      }
      // Inherit target case/evidence if not explicitly supplied
      if (!targetCaseId && parentComment.caseId) {
        targetCaseId = parentComment.caseId;
      }
      if (!targetEvidenceId && parentComment.evidenceId) {
        targetEvidenceId = parentComment.evidenceId;
      }
      targetUserIdToNotify = parentComment.userId;
    }

    // 3. Ensure at least one target (case or evidence) is specified
    if (!targetCaseId && !targetEvidenceId) {
      throw new ApiError(400, 'Comment must be linked to either a Case (caseId) or Evidence (evidenceId)');
    }

    // 4. Validate target Case exists
    if (targetCaseId) {
      const existingCase = await prisma.case.findFirst({
        where: { id: targetCaseId, deletedAt: null },
      });
      if (!existingCase) {
        throw new ApiError(404, 'Case not found');
      }
      if (!targetUserIdToNotify) {
        targetUserIdToNotify = existingCase.assignedToId || existingCase.createdById;
      }
    }

    // 5. Validate target Evidence exists
    if (targetEvidenceId) {
      const existingEvidence = await prisma.evidence.findFirst({
        where: { id: targetEvidenceId, deletedAt: null },
      });
      if (!existingEvidence) {
        throw new ApiError(404, 'Evidence not found');
      }
      if (!targetUserIdToNotify) {
        targetUserIdToNotify = existingEvidence.uploadedById;
      }
    }

    // 6. Persist comment in database
    const createdComment = await commentRepository.createComment({
      content: dto.content.trim(),
      userId: user.userId,
      caseId: targetCaseId,
      evidenceId: targetEvidenceId,
      parentCommentId: dto.parentCommentId || null,
    });

    await auditService.createLog({
      action: AuditAction.CREATE_COMMENT,
      entityType: 'COMMENT',
      entityId: createdComment.id,
      description: `Posted comment on ${targetCaseId ? 'case ' + targetCaseId : 'evidence ' + targetEvidenceId}`,
      performedById: user.userId,
      newValue: { content: createdComment.content },
    });

    if (targetUserIdToNotify && targetUserIdToNotify !== user.userId) {
      await notificationService.createNotification({
        title: 'New Comment Posted',
        message: `New comment posted on ${targetCaseId ? 'case' : 'evidence'}: "${dto.content.trim().slice(0, 50)}..."`,
        type: NotificationType.NEW_COMMENT,
        userId: targetUserIdToNotify,
        entityType: targetCaseId ? 'CASE' : 'EVIDENCE',
        entityId: (targetCaseId || targetEvidenceId) as string,
      });
    }

    return createdComment;
  }

  /**
   * Retrieves paginated comments attached to a Case with nested replies.
   */
  async getCommentsByCase(caseId: string, query: CommentQueryDto, _user: IJwtPayload) {
    const existingCase = await prisma.case.findFirst({
      where: { id: caseId, deletedAt: null },
    });
    if (!existingCase) {
      throw new ApiError(404, 'Case not found');
    }

    const { comments, total, page, limit, totalPages } = await commentRepository.findCommentsByCase(caseId, query);

    return {
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Retrieves paginated comments attached to an Evidence with nested replies.
   */
  async getCommentsByEvidence(evidenceId: string, query: CommentQueryDto, _user: IJwtPayload) {
    const existingEvidence = await prisma.evidence.findFirst({
      where: { id: evidenceId, deletedAt: null },
    });
    if (!existingEvidence) {
      throw new ApiError(404, 'Evidence not found');
    }

    const { comments, total, page, limit, totalPages } = await commentRepository.findCommentsByEvidence(evidenceId, query);

    return {
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Updates comment content and sets isEdited = true.
   */
  async updateComment(id: string, dto: UpdateCommentDto, user: IJwtPayload) {
    const comment = await commentRepository.findCommentById(id);
    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }

    // Security rule: Only comment owner or ADMIN can edit
    if (user.role !== 'ADMIN' && comment.userId !== user.userId) {
      throw new ApiError(403, 'Forbidden: You can only edit your own comments');
    }

    const updated = await commentRepository.updateComment(id, dto.content.trim());

    await auditService.createLog({
      action: AuditAction.UPDATE_COMMENT,
      entityType: 'COMMENT',
      entityId: id,
      description: `Updated comment content`,
      performedById: user.userId,
      oldValue: { content: comment.content },
      newValue: { content: dto.content.trim() },
    });

    return updated;
  }

  /**
   * Soft deletes a comment.
   */
  async deleteComment(id: string, user: IJwtPayload) {
    const comment = await commentRepository.findCommentById(id);
    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }

    // Security rule: Only comment owner or ADMIN can delete
    if (user.role !== 'ADMIN' && comment.userId !== user.userId) {
      throw new ApiError(403, 'Forbidden: You can only delete your own comments');
    }

    const deleted = await commentRepository.deleteComment(id);

    await auditService.createLog({
      action: AuditAction.DELETE_COMMENT,
      entityType: 'COMMENT',
      entityId: id,
      description: `Soft-deleted comment record`,
      performedById: user.userId,
    });

    return deleted;
  }
}

export const commentService = new CommentService();
