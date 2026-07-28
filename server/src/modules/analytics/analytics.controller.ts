import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { analyticsService } from './analytics.service.js';

/**
 * Analytics HTTP Request Controller
 * Path: server/src/modules/analytics/analytics.controller.ts
 * Purpose: Express request controller for dashboard statistics and system metrics.
 */

export const getDashboardSummaryController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await analyticsService.getDashboardSummary(req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Dashboard summary statistics retrieved successfully'));
});

export const getCaseAnalyticsController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await analyticsService.getCaseAnalytics(req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Case analytics retrieved successfully'));
});

export const getEvidenceAnalyticsController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await analyticsService.getEvidenceAnalytics(req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Evidence analytics retrieved successfully'));
});

export const getUserAnalyticsController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await analyticsService.getUserAnalytics(req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'User analytics retrieved successfully'));
});

export const getAuditAnalyticsController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await analyticsService.getAuditAnalytics(req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'Audit analytics retrieved successfully'));
});

export const getSystemAnalyticsController = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'User authentication required');
  }

  const result = await analyticsService.getSystemAnalytics(req.query, req.user);
  res.status(200).json(new ApiResponse(200, result, 'System analytics retrieved successfully'));
});
