/**
 * Custom Operational HTTP Error Class
 * Path: server/src/utils/apiError.ts
 * Purpose: Custom Exception class for throwing operational errors with HTTP status codes.
 */
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
