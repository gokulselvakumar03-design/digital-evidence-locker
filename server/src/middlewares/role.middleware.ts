import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Role-Based Authorization Middleware
 * Path: server/src/middlewares/role.middleware.ts
 * Purpose: Restricts endpoint access to specific user roles (ADMIN, INVESTIGATOR, LAWYER, VIEWER, etc.).
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError(401, 'User authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden: You do not have permission to access this resource');
    }

    next();
  };
};
