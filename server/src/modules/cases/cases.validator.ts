import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/apiError.js';
import { CaseStatus, CasePriority } from '@prisma/client';

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
 * Case ID Route Parameter Validation
 */
export const caseIdParamValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Case ID parameter is required'),
  validateRequest,
];

/**
 * Create Case Input Validation
 */
export const createCaseValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Case title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty string'),
  body('priority')
    .optional()
    .trim()
    .isIn(Object.values(CasePriority))
    .withMessage(`Invalid priority. Allowed values: ${Object.values(CasePriority).join(', ')}`),
  body('assignedToId')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Assigned investigator User ID cannot be empty string'),
  validateRequest,
];

/**
 * Update Case Input Validation
 */
export const updateCaseValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Case ID parameter is required'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty string')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty string'),
  body('priority')
    .optional()
    .trim()
    .isIn(Object.values(CasePriority))
    .withMessage(`Invalid priority. Allowed values: ${Object.values(CasePriority).join(', ')}`),
  body('assignedToId')
    .optional()
    .trim(),
  validateRequest,
];

/**
 * Update Status Input Validation
 */
export const updateStatusValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Case ID parameter is required'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Case status is required')
    .isIn(Object.values(CaseStatus))
    .withMessage(`Invalid status. Allowed values: ${Object.values(CaseStatus).join(', ')}`),
  validateRequest,
];

/**
 * Assign Investigator Validation
 */
export const assignCaseValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Case ID parameter is required'),
  body('assignedToId')
    .trim()
    .notEmpty()
    .withMessage('Assigned investigator User ID is required'),
  validateRequest,
];
