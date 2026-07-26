import { caseRepository } from './cases.repository.js';
import { userRepository } from '../users/users.repository.js';
import { CreateCaseDto, UpdateCaseDto, CaseQueryDto, UpdateCaseStatusDto, AssignCaseDto } from './cases.dto.js';
import { ICaseDetail, IPaginatedCasesResponse } from './cases.interface.js';
import { ApiError } from '../../utils/apiError.js';
import { IJwtPayload } from '../../utils/jwt.helper.js';
import { CaseStatus, CasePriority } from '@prisma/client';

/**
 * Case Business Logic Service
 * Path: server/src/modules/cases/cases.service.ts
 * Purpose: Case number auto-generation, investigator validation, and RBAC workflow enforcement.
 */
export class CaseService {
  /**
   * Generates a unique sequential case number: CASE-YYYY-000001
   */
  private async generateCaseNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `CASE-${year}-`;
    const count = await caseRepository.countCasesForPrefix(prefix);
    const nextSequence = (count + 1).toString().padStart(6, '0');
    return `${prefix}${nextSequence}`;
  }

  /**
   * Opens a new legal investigation case.
   */
  async createCase(dto: CreateCaseDto, currentUser: IJwtPayload): Promise<ICaseDetail> {
    // RBAC check: ADMIN and INVESTIGATOR can create cases
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'INVESTIGATOR') {
      throw new ApiError(403, 'Forbidden: Only ADMIN and INVESTIGATOR users can open new cases');
    }

    // Validate assigned investigator if specified
    if (dto.assignedToId) {
      const assignedUser = await userRepository.findUserById(dto.assignedToId);
      if (!assignedUser) {
        throw new ApiError(404, 'Assigned investigator user not found');
      }
    }

    const caseNumber = await this.generateCaseNumber();
    const priority = (dto.priority as CasePriority) || CasePriority.MEDIUM;

    return caseRepository.createCase({
      caseNumber,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      priority,
      createdById: currentUser.userId,
      assignedToId: dto.assignedToId,
    });
  }

  /**
   * Lists cases with pagination, search, filters, and RBAC scope restrictions.
   */
  async getAllCases(query: CaseQueryDto, currentUser: IJwtPayload): Promise<IPaginatedCasesResponse> {
    let userAccessFilter: any = undefined;

    // Non-ADMIN users (INVESTIGATOR, LAWYER, VIEWER) only see cases they created or are assigned to
    if (currentUser.role !== 'ADMIN') {
      userAccessFilter = {
        OR: [
          { createdById: currentUser.userId },
          { assignedToId: currentUser.userId },
        ],
      };
    }

    const { cases, total, page, limit } = await caseRepository.findAllCases(query, userAccessFilter);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      cases,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Retrieves full details for a single case by ID with access check.
   */
  async getCaseById(id: string, currentUser: IJwtPayload): Promise<ICaseDetail> {
    const caseItem = await caseRepository.findCaseById(id);
    if (!caseItem) {
      throw new ApiError(404, 'Case file not found');
    }

    // RBAC Check
    const isAdmin = currentUser.role === 'ADMIN';
    const isOwnerOrAssigned = caseItem.createdById === currentUser.userId || caseItem.assignedToId === currentUser.userId;

    if (!isAdmin && !isOwnerOrAssigned) {
      throw new ApiError(403, 'Forbidden: You do not have permission to view this case file');
    }

    return caseItem;
  }

  /**
   * Updates case details (title, description, category, priority, assignedToId).
   */
  async updateCase(id: string, dto: UpdateCaseDto, currentUser: IJwtPayload): Promise<ICaseDetail> {
    const caseItem = await caseRepository.findCaseById(id);
    if (!caseItem) {
      throw new ApiError(404, 'Case file not found');
    }

    // RBAC Check: Only ADMIN or assigned/creator INVESTIGATOR can update
    const isAdmin = currentUser.role === 'ADMIN';
    const isOwnerOrAssignedInvestigator =
      currentUser.role === 'INVESTIGATOR' &&
      (caseItem.createdById === currentUser.userId || caseItem.assignedToId === currentUser.userId);

    if (!isAdmin && !isOwnerOrAssignedInvestigator) {
      throw new ApiError(403, 'Forbidden: You do not have permission to update this case file');
    }

    // Validate new assigned investigator if changed
    if (dto.assignedToId) {
      const assignedUser = await userRepository.findUserById(dto.assignedToId);
      if (!assignedUser) {
        throw new ApiError(404, 'Assigned investigator user not found');
      }
    }

    return caseRepository.updateCase(id, dto);
  }

  /**
   * Changes case status (OPEN, UNDER_INVESTIGATION, IN_REVIEW, CLOSED, ARCHIVED).
   */
  async updateCaseStatus(id: string, dto: UpdateCaseStatusDto, currentUser: IJwtPayload): Promise<ICaseDetail> {
    const caseItem = await caseRepository.findCaseById(id);
    if (!caseItem) {
      throw new ApiError(404, 'Case file not found');
    }

    const isAdmin = currentUser.role === 'ADMIN';
    const isOwnerOrAssignedInvestigator =
      currentUser.role === 'INVESTIGATOR' &&
      (caseItem.createdById === currentUser.userId || caseItem.assignedToId === currentUser.userId);

    if (!isAdmin && !isOwnerOrAssignedInvestigator) {
      throw new ApiError(403, 'Forbidden: You do not have permission to change status for this case');
    }

    const targetStatus = dto.status as CaseStatus;
    let closedAt: Date | null | undefined = undefined;

    if (targetStatus === CaseStatus.CLOSED || targetStatus === CaseStatus.ARCHIVED) {
      closedAt = new Date();
    } else if (caseItem.closedAt && (targetStatus === CaseStatus.OPEN || targetStatus === CaseStatus.UNDER_INVESTIGATION)) {
      closedAt = null; // Re-opened case
    }

    return caseRepository.changeCaseStatus(id, targetStatus, closedAt);
  }

  /**
   * Assigns an investigator to a case.
   */
  async assignCase(id: string, dto: AssignCaseDto, currentUser: IJwtPayload): Promise<ICaseDetail> {
    const caseItem = await caseRepository.findCaseById(id);
    if (!caseItem) {
      throw new ApiError(404, 'Case file not found');
    }

    const isAdmin = currentUser.role === 'ADMIN';
    const isCreator = caseItem.createdById === currentUser.userId;

    if (!isAdmin && !isCreator) {
      throw new ApiError(403, 'Forbidden: Only case creator or ADMIN can assign investigators');
    }

    const assignedUser = await userRepository.findUserById(dto.assignedToId);
    if (!assignedUser) {
      throw new ApiError(404, 'Target investigator user not found');
    }

    return caseRepository.assignCase(id, dto.assignedToId);
  }

  /**
   * Soft deletes a case file.
   */
  async softDeleteCase(id: string, currentUser: IJwtPayload): Promise<void> {
    const caseItem = await caseRepository.findCaseById(id);
    if (!caseItem) {
      throw new ApiError(404, 'Case file not found');
    }

    const isAdmin = currentUser.role === 'ADMIN';
    const isCreator = caseItem.createdById === currentUser.userId;

    if (!isAdmin && !isCreator) {
      throw new ApiError(403, 'Forbidden: Only case creator or ADMIN can delete a case file');
    }

    await caseRepository.softDeleteCase(id);
  }
}

export const caseService = new CaseService();
