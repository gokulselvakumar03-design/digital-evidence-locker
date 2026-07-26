import { Router } from 'express';
import {
  registerEvidenceController,
  getEvidenceByCaseController,
  verifyHashController,
} from './evidence.controller.js';

/**
 * Evidence Express Router Setup
 * Path: server/src/modules/evidence/evidence.routes.ts
 * Purpose: Express router definition under /api/v1/evidence.
 */
const router = Router();

router.post('/', registerEvidenceController);
router.get('/case/:caseId', getEvidenceByCaseController);
router.post('/:id/verify', verifyHashController);

export default router;
