import { Router } from 'express';
import {
  analyzeEvidenceController,
  ocrController,
  speechToTextController,
  imageAnalysisController,
  videoAnalysisController,
  summarizeDocumentController,
  semanticSearchController,
  entityExtractionController,
  getAnalysisByIdController,
  getAnalysisHistoryController,
  retryAnalysisController,
  deleteAnalysisController,
} from './ai.controller.js';
import {
  analyzeEvidenceValidation,
  singleEvidenceAnalysisValidation,
  semanticSearchValidation,
  aiQueryValidation,
  aiIdParamValidation,
} from './ai.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';

/**
 * AI Gateway Express Router Setup
 * Path: server/src/modules/ai/ai.routes.ts
 * Purpose: Route mapping for AI analysis jobs, REST endpoints, history, and search under /api/v1/ai.
 */
const router = Router();

/**
 * @route   POST /api/v1/ai/analyze
 * @desc    Generic AI analysis trigger for any AnalysisType
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.post(
  '/analyze',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  analyzeEvidenceValidation,
  analyzeEvidenceController
);

/**
 * @route   POST /api/v1/ai/ocr
 * @desc    Trigger OCR text extraction
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.post(
  '/ocr',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  singleEvidenceAnalysisValidation,
  ocrController
);

/**
 * @route   POST /api/v1/ai/speech
 * @desc    Trigger Speech-to-Text transcription
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.post(
  '/speech',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  singleEvidenceAnalysisValidation,
  speechToTextController
);

/**
 * @route   POST /api/v1/ai/image
 * @desc    Trigger Image analysis
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.post(
  '/image',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  singleEvidenceAnalysisValidation,
  imageAnalysisController
);

/**
 * @route   POST /api/v1/ai/video
 * @desc    Trigger Video analysis
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.post(
  '/video',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  singleEvidenceAnalysisValidation,
  videoAnalysisController
);

/**
 * @route   POST /api/v1/ai/summarize
 * @desc    Trigger Document summarization
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.post(
  '/summarize',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  singleEvidenceAnalysisValidation,
  summarizeDocumentController
);

/**
 * @route   POST /api/v1/ai/search
 * @desc    Execute semantic vector search
 * @access  Private (ADMIN, INVESTIGATOR, LAWYER)
 */
router.post(
  '/search',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR', 'LAWYER'),
  semanticSearchValidation,
  semanticSearchController
);

/**
 * @route   POST /api/v1/ai/entities
 * @desc    Trigger Entity extraction
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.post(
  '/entities',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  singleEvidenceAnalysisValidation,
  entityExtractionController
);

/**
 * @route   GET /api/v1/ai/history
 * @desc    Get paginated AI analysis history records
 * @access  Private (ADMIN, INVESTIGATOR, LAWYER, VIEWER)
 */
router.get(
  '/history',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR', 'LAWYER', 'VIEWER'),
  aiQueryValidation,
  getAnalysisHistoryController
);

/**
 * @route   GET /api/v1/ai/:id
 * @desc    Get single AI analysis record details
 * @access  Private (ADMIN, INVESTIGATOR, LAWYER, VIEWER)
 */
router.get(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR', 'LAWYER', 'VIEWER'),
  aiIdParamValidation,
  getAnalysisByIdController
);

/**
 * @route   POST /api/v1/ai/:id/retry
 * @desc    Retry a failed AI analysis job
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.post(
  '/:id/retry',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  aiIdParamValidation,
  retryAnalysisController
);

/**
 * @route   DELETE /api/v1/ai/:id
 * @desc    Delete an AI analysis record
 * @access  Private (ADMIN, INVESTIGATOR)
 */
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'INVESTIGATOR'),
  aiIdParamValidation,
  deleteAnalysisController
);

export default router;
