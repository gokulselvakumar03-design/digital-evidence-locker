import { param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/apiError.js';
import { AuditAction } from '@prisma/client';

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
 * Audit Log ID Parameter Validation
 */
export const auditIdParamValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Audit log ID parameter is required'),
  validateRequest,
];

/**
 * Audit Log Query Parameters Validation
 */
export const auditQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('action').optional().trim().isIn(Object.values(AuditAction)).withMessage(`Invalid action. Allowed values: ${Object.values(AuditAction).join(', ')}`),
  query('entityType').optional().trim(),
  query('performedBy').optional().trim(),
  query('userId').optional().trim(),
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO8601 date string'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO8601 date string'),
  validateRequest,
];

/**
 * Entity Route Parameters Validation
 */
export const entityParamsValidation = [
  param('entityType')
    .trim()
    .notEmpty()
    .withMessage('entityType parameter is required'),
  param('entityId')
    .trim()
    .notEmpty()
    .withMessage('entityId parameter is required'),
  validateRequest,
];

/**
 * User Route Parameter Validation
 */
export const userParamValidation = [
  param('userId')
    .trim()
    .notEmpty()
    .withMessage('userId parameter is required'),
  validateRequest,
];
