import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/apiError.js';
import { AnalysisType, AnalysisStatus } from '@prisma/client';

/**
 * Express-validator Interceptor Middleware
 */
export const validateRequest = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg).join(', ');
    throw new ApiError(400, `Validation Error: ${errorMessages}`);
  }
  next();
};

/**
 * Analysis ID Parameter Validation
 */
export const aiIdParamValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Analysis ID parameter is required'),
  validateRequest,
];

/**
 * Analyze Evidence Request Payload Validation
 */
export const analyzeEvidenceValidation = [
  body('evidenceId')
    .trim()
    .notEmpty()
    .withMessage('evidenceId is required'),
  body('analysisType')
    .optional()
    .trim()
    .isIn(Object.values(AnalysisType))
    .withMessage(`Invalid analysisType. Allowed values: ${Object.values(AnalysisType).join(', ')}`),
  validateRequest,
];

/**
 * Single Evidence Analysis Shortcut Validation (e.g. /ocr, /speech, /image, /video, /summarize, /entities)
 */
export const singleEvidenceAnalysisValidation = [
  body('evidenceId')
    .trim()
    .notEmpty()
    .withMessage('evidenceId is required'),
  validateRequest,
];

/**
 * Semantic Search Payload Validation
 */
export const semanticSearchValidation = [
  body('query')
    .trim()
    .notEmpty()
    .withMessage('Search query string is required')
    .isLength({ min: 2, max: 1000 })
    .withMessage('Query must be between 2 and 1000 characters'),
  body('caseId')
    .optional()
    .trim(),
  body('evidenceId')
    .optional()
    .trim(),
  validateRequest,
];

/**
 * Query Validation (Pagination and filters)
 */
export const aiQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('evidenceId').optional().trim(),
  query('analysisType').optional().trim().isIn(Object.values(AnalysisType)).withMessage(`Invalid analysisType. Allowed values: ${Object.values(AnalysisType).join(', ')}`),
  query('status').optional().trim().isIn(Object.values(AnalysisStatus)).withMessage(`Invalid status. Allowed values: ${Object.values(AnalysisStatus).join(', ')}`),
  validateRequest,
];
