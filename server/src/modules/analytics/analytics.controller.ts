import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { analyticsService } from './analytics.service.js';

/**
 * Analytics HTTP Request Controller
 * Path: server/src/modules/analytics/analytics.controller.ts
 * Purpose: Express controller for system analytics endpoint.
 */

export const getDashboardStatsController = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const stats = await analyticsService.getDashboardStats();
  res.status(200).json(new ApiResponse(200, stats, 'Dashboard analytics retrieved successfully'));
});
