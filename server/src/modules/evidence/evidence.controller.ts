import { Response } from 'express';
import 'multer';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { evidenceService } from './evidence.service.js';

export interface EvidenceUploadRequest extends AuthenticatedRequest {
  file?: Express.Multer.File;
}

/**
 * Evidence HTTP Request Controller
 * Path: server/src/modules/evidence/evidence.controller.ts
 * Purpose: Thin Express request controller for handling Evidence API endpoints.
 */

export const uploadEvidenceController = asyncHandler(async (req: EvidenceUploadRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  if (!req.file) {
    throw new ApiError(400, 'Uploaded file is required');
  }

  const result = await evidenceService.uploadEvidence(req.body, req.file, req.user);
  res.status(201).json(new ApiResponse(201, result, 'Evidence file uploaded and metadata registered successfully'));
});

export const getAllEvidenceController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await evidenceService.getAllEvidence(req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Evidence list retrieved successfully'));
});

export const getEvidenceByIdController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const evidence = await evidenceService.getEvidenceById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, evidence, 'Evidence metadata retrieved successfully'));
});

export const updateEvidenceController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const updated = await evidenceService.updateEvidence(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, updated, 'Evidence metadata updated successfully'));
});

export const updateStatusController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const updated = await evidenceService.changeEvidenceStatus(req.params.id, req.body.status, req.user);
  res.status(200).json(new ApiResponse(200, updated, 'Evidence status updated successfully'));
});

export const deleteEvidenceController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const deleted = await evidenceService.softDeleteEvidence(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, deleted, 'Evidence soft deleted successfully'));
});
