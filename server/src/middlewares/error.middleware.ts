import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../config/logger.js';

/**
 * Global Exception Handling Middleware
 * Path: server/src/middlewares/error.middleware.ts
 * Purpose: Intercepts all unhandled errors, formats standardized JSON response envelope, and logs stack traces.
 */
export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.message) {
    message = err.message;
  }

  logger.error(`Error ${statusCode}: ${message}`, { stack: err.stack });

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode === 404 ? 'RESOURCE_NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
