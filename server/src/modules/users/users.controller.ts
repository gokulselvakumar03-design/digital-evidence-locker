import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { userService } from './users.service.js';

/**
 * Users HTTP Request Controller
 * Path: server/src/modules/users/users.controller.ts
 * Purpose: Handles HTTP endpoint routing for user management.
 */

export const getAllUsersController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const users = await userService.getAllUsers(req.query);
  res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
});

export const getUserByIdController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json(new ApiResponse(200, user, 'User retrieved successfully'));
});

export const updateUserController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, updatedUser, 'User updated successfully'));
});
