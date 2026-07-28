import { Router } from 'express';
import multer from 'multer';
import {
  uploadEvidenceController,
  getAllEvidenceController,
  getEvidenceByIdController,
  updateEvidenceController,
  updateStatusController,
  deleteEvidenceController,
} from './evidence.controller.js';
import {
  createEvidenceValidation,
  updateEvidenceValidation,
  updateStatusValidation,
  evidenceIdParamValidation,
  evidenceQueryValidation,
} from './evidence.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';

/**
 * Evidence Express Router Setup
 * Path: server/src/modules/evidence/evidence.routes.ts
 * Purpose: Endpoint definitions for evidence upload, metadata retrieval, status changes, and soft delete.
 */
const router = Router();

// Multer memory storage configuration (100 MB max)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

/**
 * @route   POST /api/v1/evidence
 * @desc    Upload evidence file (multipart form-data) and metadata
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  upload.single('file'),
  createEvidenceValidation,
  uploadEvidenceController
);

/**
 * @route   GET /api/v1/evidence
 * @desc    Get paginated, searchable, and filtered evidence list
 * @access  Private (ADMIN, INVESTIGATOR, LAWYER, VIEWER)
 */
router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR', 'LAWYER', 'VIEWER'),
  evidenceQueryValidation,
  getAllEvidenceController
);

/**
 * @route   GET /api/v1/evidence/:id
 * @desc    Get complete metadata for a specific evidence item
 * @access  Private (ADMIN, INVESTIGATOR, LAWYER, VIEWER)
 */
router.get(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR', 'LAWYER', 'VIEWER'),
  evidenceIdParamValidation,
  getEvidenceByIdController
);

/**
 * @route   PUT /api/v1/evidence/:id
 * @desc    Update evidence metadata (title, description, tags, remarks)
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  updateEvidenceValidation,
  updateEvidenceController
);

/**
 * @route   PATCH /api/v1/evidence/:id/status
 * @desc    Update evidence status (PENDING, VERIFIED, APPROVED, REJECTED, ARCHIVED, etc.)
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  updateStatusValidation,
  updateStatusController
);

/**
 * @route   DELETE /api/v1/evidence/:id
 * @desc    Soft delete an evidence record
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  evidenceIdParamValidation,
  deleteEvidenceController
);

export default router;
