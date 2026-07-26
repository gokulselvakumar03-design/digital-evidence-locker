import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { aiService } from './ai.service.js';

/**
 * AI HTTP Request Controller
 * Path: server/src/modules/ai/ai.controller.ts
 * Purpose: Express controller for proxying requests to AI microservice.
 */

export const transcribeController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await aiService.requestTranscription(req.body);
  res.status(202).json(new ApiResponse(202, result, 'Transcription job dispatched'));
});

export const ocrController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await aiService.requestOcr(req.body);
  res.status(202).json(new ApiResponse(202, result, 'OCR job dispatched'));
});

export const summarizeController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await aiService.requestCaseSummary(req.body);
  res.status(200).json(new ApiResponse(200, result, 'Case summary generated'));
});
