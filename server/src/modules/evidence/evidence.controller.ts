import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { evidenceService } from './evidence.service.js';

/**
 * Evidence HTTP Request Controller
 * Path: server/src/modules/evidence/evidence.controller.ts
 * Purpose: Express request handler for digital evidence registration and integrity checks.
 */

export const registerEvidenceController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await evidenceService.registerEvidence(req.body, 'stub_user_id');
  res.status(201).json(new ApiResponse(201, result, 'Evidence metadata registered successfully'));
});

export const getEvidenceByCaseController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const list = await evidenceService.getEvidenceByCase(req.params.caseId, req.query);
  res.status(200).json(new ApiResponse(200, list, 'Case evidence retrieved successfully'));
});

export const verifyHashController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const verification = await evidenceService.verifyHash(req.params.id, req.body, 'stub_user_id');
  res.status(200).json(new ApiResponse(200, verification, 'Evidence hash verification completed'));
});
