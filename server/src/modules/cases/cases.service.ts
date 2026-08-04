import { caseRepository } from './cases.repository.js';
import { userRepository } from '../users/users.repository.js';
import { CreateCaseDto, UpdateCaseDto, CaseQueryDto, UpdateCaseStatusDto, AssignCaseDto } from './cases.dto.js';
import { ICaseDetail, IPaginatedCasesResponse } from './cases.interface.js';
import { ApiError } from '../../utils/apiError.js';
import { IJwtPayload } from '../../utils/jwt.helper.js';
import { CaseStatus, CasePriority, AuditAction, NotificationType } from '@prisma/client';
import { auditService } from '../audit/audit.service.js';
import { notificationService } from '../notifications/notifications.service.js';

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

    const createdCase = await caseRepository.createCase({
      caseNumber,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      priority,
      createdById: currentUser.userId,
      assignedToId: dto.assignedToId,
    });

    await auditService.createLog({
      action: AuditAction.CREATE_CASE,
      entityType: 'CASE',
      entityId: createdCase.id,
      description: `Created new case ${createdCase.caseNumber}: '${createdCase.title}'`,
      performedById: currentUser.userId,
      newValue: { caseNumber: createdCase.caseNumber, title: createdCase.title },
    });

    return createdCase;
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

    const updatedCase = await caseRepository.updateCase(id, dto);

    await auditService.createLog({
      action: AuditAction.UPDATE_CASE,
      entityType: 'CASE',
      entityId: id,
      description: `Updated case file details for ${caseItem.caseNumber}`,
      performedById: currentUser.userId,
      oldValue: { title: caseItem.title, priority: caseItem.priority },
      newValue: dto,
    });

    if (caseItem.assignedToId && caseItem.assignedToId !== currentUser.userId) {
      await notificationService.createNotification({
        title: `Case Updated: ${caseItem.caseNumber}`,
        message: `Case '${caseItem.title}' details have been updated.`,
        type: NotificationType.CASE_UPDATED,
        userId: caseItem.assignedToId,
        entityType: 'CASE',
        entityId: id,
      });
    }

    return updatedCase;
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

    const updatedCase = await caseRepository.changeCaseStatus(id, targetStatus, closedAt);

    await auditService.createLog({
      action: AuditAction.CHANGE_CASE_STATUS,
      entityType: 'CASE',
      entityId: id,
      description: `Changed status of case ${caseItem.caseNumber} from ${caseItem.status} to ${targetStatus}`,
      performedById: currentUser.userId,
      oldValue: { status: caseItem.status },
      newValue: { status: targetStatus },
    });

    if (targetStatus === CaseStatus.CLOSED || targetStatus === CaseStatus.ARCHIVED) {
      const notifyUserId = caseItem.assignedToId || caseItem.createdById;
      if (notifyUserId && notifyUserId !== currentUser.userId) {
        await notificationService.createNotification({
          title: `Case Closed: ${caseItem.caseNumber}`,
          message: `Case '${caseItem.title}' has been marked as ${targetStatus}.`,
          type: NotificationType.CASE_CLOSED,
          userId: notifyUserId,
          entityType: 'CASE',
          entityId: id,
        });
      }
    }

    return updatedCase;
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

    const assignedCase = await caseRepository.assignCase(id, dto.assignedToId);

    await auditService.createLog({
      action: AuditAction.ASSIGN_CASE,
      entityType: 'CASE',
      entityId: id,
      description: `Assigned case ${caseItem.caseNumber} to user ${assignedUser.email}`,
      performedById: currentUser.userId,
      oldValue: { assignedToId: caseItem.assignedToId },
      newValue: { assignedToId: dto.assignedToId },
    });

    await notificationService.createNotification({
      title: `Case Assigned: ${caseItem.caseNumber}`,
      message: `You have been assigned to case '${caseItem.title}'.`,
      type: NotificationType.CASE_ASSIGNED,
      userId: dto.assignedToId,
      entityType: 'CASE',
      entityId: id,
    });

    return assignedCase;
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

    await auditService.createLog({
      action: AuditAction.DELETE_CASE,
      entityType: 'CASE',
      entityId: id,
      description: `Soft-deleted case file ${caseItem.caseNumber}`,
      performedById: currentUser.userId,
    });
  }
}

export const caseService = new CaseService();
