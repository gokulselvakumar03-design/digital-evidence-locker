import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/apiError.js';

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
 * Comment ID Parameter Validation
 */
export const commentIdParamValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Comment ID parameter is required'),
  validateRequest,
];

/**
 * Create Comment Input Validation
 */
export const createCommentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 3, max: 2000 })
    .withMessage('Content must be between 3 and 2000 characters'),
  body('caseId')
    .optional()
    .trim(),
  body('evidenceId')
    .optional()
    .trim(),
  body('parentCommentId')
    .optional()
    .trim(),
  body().custom((value) => {
    if (!value.caseId && !value.evidenceId && !value.parentCommentId) {
      throw new Error('At least one of caseId, evidenceId, or parentCommentId must be provided');
    }
    return true;
  }),
  validateRequest,
];

/**
 * Update Comment Input Validation
 */
export const updateCommentValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Comment ID parameter is required'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 3, max: 2000 })
    .withMessage('Content must be between 3 and 2000 characters'),
  validateRequest,
];

/**
 * Comments Query Parameters Validation
 */
export const commentsQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  validateRequest,
];
