import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { authService } from './auth.service.js';

/**
 * Authentication HTTP Request Controller
 * Path: server/src/modules/auth/auth.controller.ts
 * Purpose: Handles HTTP transport, delegates to AuthService, returns JSON envelopes.
 */

export const registerController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.register(req.body);
  res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
});

export const loginController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.login(req.body);
  res.status(200).json(new ApiResponse(200, result, 'Login successful'));
});

export const logoutController = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  // Stub logout response
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const getMeController = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  // Stub get current user response
  res.status(200).json(new ApiResponse(200, { message: 'Stub current user profile' }, 'Profile retrieved'));
});
