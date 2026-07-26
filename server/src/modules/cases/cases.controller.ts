import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { caseService } from './cases.service.js';

/**
 * Case HTTP Request Controller
 * Path: server/src/modules/cases/cases.controller.ts
 * Purpose: Handles Express request lifecycle for Case management APIs.
 */

export const createCaseController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const newCase = await caseService.createCase(req.body, 'stub_user_id');
  res.status(201).json(new ApiResponse(201, newCase, 'Case opened successfully'));
});

export const getCaseByIdController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const caseData = await caseService.getCaseById(req.params.id);
  res.status(200).json(new ApiResponse(200, caseData, 'Case details retrieved'));
});

export const listCasesController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const cases = await caseService.listCases(req.query);
  res.status(200).json(new ApiResponse(200, cases, 'Cases list retrieved'));
});

export const addCaseMemberController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await caseService.addCaseMember(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, null, 'Member assigned to case successfully'));
});
