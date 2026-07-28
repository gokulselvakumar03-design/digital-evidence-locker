import { query, validationResult } from 'express-validator';
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
 * Analytics Query Validation Rules
 */
export const analyticsQueryValidation = [
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO8601 date string'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO8601 date string'),
  query('role').optional().trim(),
  query('status').optional().trim(),
  query('category').optional().trim(),
  query('priority').optional().trim(),
  validateRequest,
];
