import { param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/apiError.js';
import { NotificationType } from '@prisma/client';

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
 * Notification ID Parameter Validation
 */
export const notificationIdParamValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Notification ID parameter is required'),
  validateRequest,
];

/**
 * Notification Query Parameters Validation
 */
export const notificationQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('isRead').optional().trim(),
  query('type').optional().trim().isIn(Object.values(NotificationType)).withMessage(`Invalid type. Allowed values: ${Object.values(NotificationType).join(', ')}`),
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO8601 date string'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO8601 date string'),
  validateRequest,
];
