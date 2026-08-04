import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/apiError.js';
import { Role } from '@prisma/client';

/**
 * Validation Error Interceptor Middleware
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
 * User ID Route Parameter Validation
 */
export const userIdParamValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('User ID is required'),
  validateRequest,
];

/**
 * Profile Update Input Validation
 */
export const updateUserValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('User ID is required'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('role')
    .optional()
    .trim()
    .isIn(Object.values(Role))
    .withMessage(`Invalid role. Allowed roles are: ${Object.values(Role).join(', ')}`),
  validateRequest,
];

/**
 * User Activation Status Toggle Validation
 */
export const updateStatusValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('User ID is required'),
  body('isActive')
    .notEmpty()
    .withMessage('isActive status boolean is required')
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  validateRequest,
];
