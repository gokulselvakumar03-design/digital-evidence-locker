import { Request, Response, NextFunction } from 'express';
import { JwtHelper, IJwtPayload } from '../utils/jwt.helper.js';
import { ApiError } from '../utils/apiError.js';

export interface AuthenticatedRequest extends Request {
  user?: IJwtPayload;
}

/**
 * Authentication Middleware
 * Path: server/src/middlewares/auth.middleware.ts
 * Purpose: Verifies JWT access token from Authorization header or cookie and attaches user to request.
 */
export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  let token: string | undefined;

  // Extract Bearer token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Extract token from HTTP-only cookie
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError(401, 'Authentication token missing or not provided');
  }

  // Verify and decode token (JwtHelper throws 401 for expired/invalid tokens)
  const decoded = JwtHelper.verifyToken(token);
  req.user = decoded;
  next();
};
