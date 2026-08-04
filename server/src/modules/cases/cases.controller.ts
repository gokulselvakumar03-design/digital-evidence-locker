import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { caseService } from './cases.service.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { ApiError } from '../../utils/apiError.js';

/**
 * Case HTTP Request Controller
 * Path: server/src/modules/cases/cases.controller.ts
 * Purpose: Handles HTTP endpoint transport for Case Management operations.
 */

export const createCaseController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized access');
  }
  const result = await caseService.createCase(req.body, req.user);
  res.status(201).json(new ApiResponse(201, result, 'Case file created successfully'));
});

export const getAllCasesController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized access');
  }
  const result = await caseService.getAllCases(req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Cases list retrieved successfully'));
});

export const getCaseByIdController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized access');
  }
  const result = await caseService.getCaseById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Case details retrieved successfully'));
});

export const updateCaseController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized access');
  }
  const result = await caseService.updateCase(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Case file updated successfully'));
});

export const updateStatusController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized access');
  }
  const result = await caseService.updateCaseStatus(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Case status updated successfully'));
});

export const assignCaseController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized access');
  }
  const result = await caseService.assignCase(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Investigator assigned to case successfully'));
});

export const deleteCaseController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized access');
  }
  await caseService.softDeleteCase(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, null, 'Case file soft-deleted successfully'));
});
