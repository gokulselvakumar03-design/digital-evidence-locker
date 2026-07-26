import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Async Exception Handler Wrapper
 * Path: server/src/utils/asyncHandler.ts
 * Purpose: Catches rejected promises in async route handlers and forwards errors to next().
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
