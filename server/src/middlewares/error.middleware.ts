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

  const getErrorCodeString = (code: number): string => {
    switch (code) {
      case 400: return 'BAD_REQUEST';
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'RESOURCE_NOT_FOUND';
      case 409: return 'CONFLICT';
      case 422: return 'UNPROCESSABLE_ENTITY';
      case 429: return 'TOO_MANY_REQUESTS';
      default: return 'INTERNAL_SERVER_ERROR';
    }
  };

  res.status(statusCode).json({
    success: false,
    error: {
      code: getErrorCodeString(statusCode),
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
