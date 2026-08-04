import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { auditService } from './audit.service.js';

/**
 * Audit Logs HTTP Request Controller
 * Path: server/src/modules/audit/audit.controller.ts
 * Purpose: Express request controller for querying immutable audit log records.
 */

export const getAllLogsController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await auditService.getAllLogs(req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Audit logs retrieved successfully'));
});

export const getLogByIdController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const log = await auditService.getLogById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, log, 'Audit log details retrieved successfully'));
});

export const getLogsByUserController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await auditService.getLogsByUser(req.params.userId, req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'User audit logs retrieved successfully'));
});

export const getLogsByEntityController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await auditService.getLogsByEntity(req.params.entityType, req.params.entityId, req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Entity audit logs retrieved successfully'));
});
