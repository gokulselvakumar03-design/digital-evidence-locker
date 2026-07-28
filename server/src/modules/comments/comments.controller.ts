import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { commentService } from './comments.service.js';

/**
 * Comments HTTP Request Controller
 * Path: server/src/modules/comments/comments.controller.ts
 * Purpose: Express request handler for comments and collaboration operations.
 */

export const createCommentController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const comment = await commentService.createComment(req.body, req.user);
  res.status(201).json(new ApiResponse(201, comment, 'Comment created successfully'));
});

export const getCommentsByCaseController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await commentService.getCommentsByCase(req.params.caseId, req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Case comments retrieved successfully'));
});

export const getCommentsByEvidenceController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await commentService.getCommentsByEvidence(req.params.evidenceId, req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Evidence comments retrieved successfully'));
});

export const updateCommentController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const updatedComment = await commentService.updateComment(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, updatedComment, 'Comment updated successfully'));
});

export const deleteCommentController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const deletedComment = await commentService.deleteComment(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, deletedComment, 'Comment soft deleted successfully'));
});
