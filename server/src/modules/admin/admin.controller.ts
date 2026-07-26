import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { adminService } from './admin.service.js';

/**
 * Admin HTTP Request Controller
 * Path: server/src/modules/admin/admin.controller.ts
 * Purpose: Express controller for system audit trail access.
 */

export const getAuditLogsController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const logs = await adminService.fetchAuditLogs(req.query);
  res.status(200).json(new ApiResponse(200, logs, 'Audit logs retrieved successfully'));
});
