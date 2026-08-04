import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { authService } from './auth.service.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { ApiError } from '../../utils/apiError.js';

/**
 * Authentication HTTP Request Controller
 * Path: server/src/modules/auth/auth.controller.ts
 * Purpose: Handles HTTP request serialization & response formatting for Auth endpoints.
 */

export const registerController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.register(req.body);
  res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
});

export const loginController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.login(req.body);

  // Set HTTP-only cookie for token
  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json(new ApiResponse(200, result, 'Login successful'));
});

export const getProfileController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user || !req.user.userId) {
    throw new ApiError(401, 'Unauthorized: User context missing');
  }

  const profile = await authService.getProfile(req.user.userId);
  res.status(200).json(new ApiResponse(200, profile, 'User profile retrieved successfully'));
});

export const logoutController = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('token');
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});
