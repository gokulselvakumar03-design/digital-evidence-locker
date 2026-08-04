import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { userService } from './users.service.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { ApiError } from '../../utils/apiError.js';

/**
 * Users HTTP Request Controller
 * Path: server/src/modules/users/users.controller.ts
 * Purpose: Handles HTTP endpoint transport for Users management module.
 */

export const getAllUsersController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await userService.getAllUsers(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Users list retrieved successfully'));
});

export const getUserByIdController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized access');
  }
  const user = await userService.getUserById(req.params.id, req.user);
  res.status(200).json(new ApiResponse(200, user, 'User profile retrieved successfully'));
});

export const updateUserController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized access');
  }
  const updatedUser = await userService.updateUser(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, updatedUser, 'User profile updated successfully'));
});

export const deleteUserController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await userService.softDeleteUser(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});

export const updateStatusController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const updatedUser = await userService.updateUserStatus(req.params.id, req.body.isActive);
  res.status(200).json(new ApiResponse(200, updatedUser, 'User status updated successfully'));
});
