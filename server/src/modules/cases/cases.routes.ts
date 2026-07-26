import { Router } from 'express';
import {
  createCaseController,
  getCaseByIdController,
  listCasesController,
  addCaseMemberController,
} from './cases.controller.js';

/**
 * Case Express Router Setup
 * Path: server/src/modules/cases/cases.routes.ts
 * Purpose: Express router definition under /api/v1/cases.
 */
const router = Router();

router.post('/', createCaseController);
router.get('/', listCasesController);
router.get('/:id', getCaseByIdController);
router.post('/:id/members', addCaseMemberController);

export default router;
