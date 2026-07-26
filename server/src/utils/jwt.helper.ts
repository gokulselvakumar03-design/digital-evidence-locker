import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';
import { ApiError } from './apiError.js';

export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * JWT Utility Helper
 * Path: server/src/utils/jwt.helper.ts
 * Purpose: Generates and verifies JWT tokens with proper error handling.
 */
export class JwtHelper {
  /**
   * Generates a signed JWT Access Token
   */
  static generateToken(payload: IJwtPayload): string {
    const options: jwt.SignOptions = {
      expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    };
    return jwt.sign(payload, config.jwtSecret, options);
  }

  /**
   * Verifies and decodes a JWT Access Token
   */
  static verifyToken(token: string): IJwtPayload {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as IJwtPayload;
      return decoded;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Token expired');
      }
      throw new ApiError(401, 'Invalid token');
    }
  }
}
