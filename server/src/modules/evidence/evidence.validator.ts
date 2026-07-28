import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import 'multer';
import { ApiError } from '../../utils/apiError.js';
import { EvidenceStatus } from '@prisma/client';

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'mp4', 'wav', 'mp3', 'zip'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

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
 * Validates uploaded file extension and maximum size limit.
 */
export const validateFileUpload = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.file) {
    throw new ApiError(400, 'Uploaded evidence file is required in request field "file"');
  }

  const originalName = req.file.originalname || '';
  const ext = originalName.split('.').pop()?.toLowerCase();

  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    throw new ApiError(
      400,
      `Invalid file extension '${ext ? '.' + ext : 'none'}'. Allowed file extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
    );
  }

  if (req.file.size > MAX_FILE_SIZE) {
    throw new ApiError(400, `File size (${(req.file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum upload limit of 100 MB`);
  }

  next();
};

/**
 * Evidence ID Param Validation
 */
export const evidenceIdParamValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Evidence ID parameter is required'),
  validateRequest,
];

/**
 * Create Evidence Payload Validation
 */
export const createEvidenceValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Evidence title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('caseId')
    .trim()
    .notEmpty()
    .withMessage('Case ID is required'),
  body('description')
    .optional()
    .trim(),
  body('tags')
    .optional(),
  validateRequest,
  validateFileUpload,
];

/**
 * Update Evidence Payload Validation
 */
export const updateEvidenceValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Evidence ID parameter is required'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('remarks')
    .optional()
    .trim(),
  body('tags')
    .optional(),
  validateRequest,
];

/**
 * Update Status Payload Validation
 */
export const updateStatusValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Evidence ID parameter is required'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(EvidenceStatus))
    .withMessage(`Invalid evidence status. Allowed values: ${Object.values(EvidenceStatus).join(', ')}`),
  validateRequest,
];

/**
 * Query Validation (Pagination, search, filters)
 */
export const evidenceQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('caseId').optional().trim(),
  query('status').optional().trim(),
  query('fileType').optional().trim(),
  query('uploaderId').optional().trim(),
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO8601 date string'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO8601 date string'),
  validateRequest,
];
