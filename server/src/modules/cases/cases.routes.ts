import { Router } from 'express';
import {
  createCaseController,
  getAllCasesController,
  getCaseByIdController,
  updateCaseController,
  updateStatusController,
  assignCaseController,
  deleteCaseController,
} from './cases.controller.js';
import {
  caseIdParamValidation,
  createCaseValidation,
  updateCaseValidation,
  updateStatusValidation,
  assignCaseValidation,
} from './cases.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';

/**
 * Case Express Router Setup
 * Path: server/src/modules/cases/cases.routes.ts
 * Purpose: Route mapping for Case Management endpoints under /api/cases and /api/v1/cases.
 */
const router = Router();

// 1. POST /api/v1/cases (Create case - ADMIN, INVESTIGATOR)
router.post('/', authenticate, authorizeRoles('ADMIN', 'INVESTIGATOR'), createCaseValidation, createCaseController);

// 2. GET /api/v1/cases (List cases with search, pagination, filters - All authenticated users with RBAC filter)
router.get('/', authenticate, getAllCasesController);

// 3. GET /api/v1/cases/:id (Get full case detail - All authenticated users with RBAC check)
router.get('/:id', authenticate, caseIdParamValidation, getCaseByIdController);

// 4. PUT /api/v1/cases/:id (Update case - ADMIN, INVESTIGATOR)
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'INVESTIGATOR'), updateCaseValidation, updateCaseController);

// 5. PATCH /api/v1/cases/:id/status (Update case status - ADMIN, INVESTIGATOR)
router.patch('/:id/status', authenticate, authorizeRoles('ADMIN', 'INVESTIGATOR'), updateStatusValidation, updateStatusController);

// 6. PATCH /api/v1/cases/:id/assign (Assign investigator - ADMIN, INVESTIGATOR)
router.patch('/:id/assign', authenticate, authorizeRoles('ADMIN', 'INVESTIGATOR'), assignCaseValidation, assignCaseController);

// 7. DELETE /api/v1/cases/:id (Soft delete case - ADMIN, INVESTIGATOR)
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'INVESTIGATOR'), caseIdParamValidation, deleteCaseController);

export default router;
