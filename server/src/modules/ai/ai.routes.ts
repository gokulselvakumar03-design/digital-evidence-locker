import { Router } from 'express';
import { transcribeController, ocrController, summarizeController } from './ai.controller.js';

/**
 * AI Gateway Express Router Setup
 * Path: server/src/modules/ai/ai.routes.ts
 * Purpose: Express router definition under /api/v1/ai.
 */
const router = Router();

router.post('/transcribe', transcribeController);
router.post('/ocr', ocrController);
router.post('/summarize', summarizeController);

export default router;
