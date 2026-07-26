import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { commentService } from './comments.service.js';

/**
 * Comments HTTP Request Controller
 * Path: server/src/modules/comments/comments.controller.ts
 * Purpose: Express request handler for comments operations.
 */

export const addCommentController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const comment = await commentService.addComment(req.body, 'stub_user_id');
  res.status(201).json(new ApiResponse(201, comment, 'Comment posted successfully'));
});

export const getCommentsByCaseController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const comments = await commentService.getCommentsByCase(req.params.caseId);
  res.status(200).json(new ApiResponse(200, comments, 'Comments retrieved successfully'));
});
