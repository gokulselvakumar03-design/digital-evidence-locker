import { Router } from 'express';
import { addCommentController, getCommentsByCaseController } from './comments.controller.js';

/**
 * Comments Express Router Setup
 * Path: server/src/modules/comments/comments.routes.ts
 * Purpose: Express router definition under /api/v1/comments.
 */
const router = Router();

router.post('/', addCommentController);
router.get('/case/:caseId', getCommentsByCaseController);

export default router;
