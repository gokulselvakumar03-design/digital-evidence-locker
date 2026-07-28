import { Router } from 'express';
import {
  createCommentController,
  getCommentsByCaseController,
  getCommentsByEvidenceController,
  updateCommentController,
  deleteCommentController,
} from './comments.controller.js';
import {
  createCommentValidation,
  updateCommentValidation,
  commentIdParamValidation,
  commentsQueryValidation,
} from './comments.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';

/**
 * Comments Express Router Setup
 * Path: server/src/modules/comments/comments.routes.ts
 * Purpose: Route mapping for case/evidence comments, threaded replies, updates, and deletion under /api/v1/comments.
 */
const router = Router();

/**
 * @route   POST /api/v1/comments
 * @desc    Create a comment or threaded reply
 * @access  Private (ADMIN, INVESTIGATOR, LAWYER)
 */
router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR', 'LAWYER'),
  createCommentValidation,
  createCommentController
);

/**
 * @route   GET /api/v1/comments/case/:caseId
 * @desc    Get comments attached to a Case with pagination and search
 * @access  Private (ADMIN, INVESTIGATOR, LAWYER, VIEWER)
 */
router.get(
  '/case/:caseId',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR', 'LAWYER', 'VIEWER'),
  commentsQueryValidation,
  getCommentsByCaseController
);

/**
 * @route   GET /api/v1/comments/evidence/:evidenceId
 * @desc    Get comments attached to an Evidence with pagination and search
 * @access  Private (ADMIN, INVESTIGATOR, LAWYER, VIEWER)
 */
router.get(
  '/evidence/:evidenceId',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR', 'LAWYER', 'VIEWER'),
  commentsQueryValidation,
  getCommentsByEvidenceController
);

/**
 * @route   PUT /api/v1/comments/:id
 * @desc    Update a comment (Owner or ADMIN)
 * @access  Private (ADMIN, INVESTIGATOR, LAWYER)
 */
router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR', 'LAWYER'),
  updateCommentValidation,
  updateCommentController
);

/**
 * @route   DELETE /api/v1/comments/:id
 * @desc    Soft delete a comment (Owner or ADMIN)
 * @access  Private (ADMIN, INVESTIGATOR, LAWYER)
 */
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR', 'LAWYER'),
  commentIdParamValidation,
  deleteCommentController
);

export default router;
