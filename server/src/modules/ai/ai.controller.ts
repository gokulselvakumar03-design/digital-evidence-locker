import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { aiService } from './ai.service.js';

/**
 * AI Integration HTTP Request Controller
 * Path: server/src/modules/ai/ai.controller.ts
 * Purpose: Thin Express controller handling requests for external AI analysis triggers and historical results.
 */

export const analyzeEvidenceController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await aiService.analyzeEvidence(req.body, req.user);
  res.status(200).json(new ApiResponse(200, result, 'AI analysis job executed successfully'));
});

export const ocrController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await aiService.performOCR(req.body.evidenceId, req.user);
  res.status(200).json(new ApiResponse(200, result, 'OCR analysis executed successfully'));
});

export const speechToTextController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await aiService.speechToText(req.body.evidenceId, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Speech-to-text analysis executed successfully'));
});

export const imageAnalysisController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await aiService.imageAnalysis(req.body.evidenceId, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Image analysis executed successfully'));
});

export const videoAnalysisController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await aiService.videoAnalysis(req.body.evidenceId, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Video analysis executed successfully'));
});

export const summarizeDocumentController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await aiService.summarizeDocument(req.body.evidenceId, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Document summarization executed successfully'));
});

export const semanticSearchController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await aiService.semanticSearch(req.body, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Semantic search completed successfully'));
});

export const entityExtractionController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await aiService.entityExtraction(req.body.evidenceId, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Entity extraction executed successfully'));
});

export const getAnalysisByIdController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await aiService.getAnalysisById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, result, 'AI Analysis record retrieved successfully'));
});

export const getAnalysisHistoryController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await aiService.getAnalysisHistory(req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'AI Analysis history retrieved successfully'));
});

export const retryAnalysisController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await aiService.retryAnalysis(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, result, 'AI Analysis job retried successfully'));
});

export const deleteAnalysisController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await aiService.deleteAnalysis(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, result, 'AI Analysis record deleted successfully'));
});
