import prisma from '../../config/prisma.js';
import { UpdateCaseDto, CaseQueryDto } from './cases.dto.js';
import { CaseStatus, CasePriority } from '@prisma/client';

export interface ICreateCaseRepoInput {
  caseNumber: string;
  title: string;
  description?: string;
  category?: string;
  priority?: CasePriority;
  createdById: string;
  assignedToId?: string;
}

/**
 * Case Data Access Repository
 * Path: server/src/modules/cases/cases.repository.ts
 * Purpose: Executes Prisma queries for Case management operations with soft-delete filtering.
 */
export class CaseRepository {
  /**
   * Persists a new Case record.
   */
  async createCase(input: ICreateCaseRepoInput) {
    return prisma.case.create({
      data: {
        caseNumber: input.caseNumber,
        title: input.title,
        description: input.description,
        category: input.category || 'GENERAL',
        priority: input.priority || CasePriority.MEDIUM,
        status: CaseStatus.OPEN,
        createdById: input.createdById,
        assignedToId: input.assignedToId || null,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  /**
   * Retrieves paginated, filtered cases with user access boundaries.
   */
  async findAllCases(query: CaseQueryDto, userAccessFilter?: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      deletedAt: null,
      ...userAccessFilter,
    };

    if (query.status && Object.values(CaseStatus).includes(query.status as CaseStatus)) {
      whereClause.status = query.status as CaseStatus;
    }

    if (query.priority && Object.values(CasePriority).includes(query.priority as CasePriority)) {
      whereClause.priority = query.priority as CasePriority;
    }

    if (query.category) {
      whereClause.category = { equals: query.category, mode: 'insensitive' };
    }

    if (query.assignedToId) {
      whereClause.assignedToId = query.assignedToId;
    }

    if (query.search) {
      whereClause.AND = [
        {
          OR: [
            { title: { contains: query.search, mode: 'insensitive' } },
            { caseNumber: { contains: query.search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    // Determine sorting order
    let orderBy: any = { createdAt: 'desc' };
    if (query.sort === 'createdAt_asc' || query.sort === 'asc') {
      orderBy = { createdAt: 'asc' };
    } else if (query.sort === 'priority_desc') {
      orderBy = { priority: 'desc' };
    } else if (query.sort === 'priority_asc') {
      orderBy = { priority: 'asc' };
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: {
          createdBy: { select: { id: true, name: true, email: true, role: true } },
          assignedTo: { select: { id: true, name: true, email: true, role: true } },
        },
      }),
      prisma.case.count({ where: whereClause }),
    ]);

    return { cases, total, page, limit };
  }

  /**
   * Finds non-deleted case detail by ID.
   */
  async findCaseById(id: string) {
    return prisma.case.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  /**
   * Updates case details.
   */
  async updateCase(id: string, dto: UpdateCaseDto) {
    const dataToUpdate: any = {};
    if (dto.title !== undefined) dataToUpdate.title = dto.title;
    if (dto.description !== undefined) dataToUpdate.description = dto.description;
    if (dto.category !== undefined) dataToUpdate.category = dto.category;
    if (dto.priority !== undefined && Object.values(CasePriority).includes(dto.priority as CasePriority)) {
      dataToUpdate.priority = dto.priority as CasePriority;
    }
    if (dto.assignedToId !== undefined) dataToUpdate.assignedToId = dto.assignedToId || null;

    return prisma.case.update({
      where: { id },
      data: dataToUpdate,
      include: {
        createdBy: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  /**
   * Changes case status and sets closedAt timestamp if status is CLOSED or ARCHIVED.
   */
  async changeCaseStatus(id: string, status: CaseStatus, closedAt?: Date | null) {
    const dataToUpdate: any = { status };
    if (closedAt !== undefined) {
      dataToUpdate.closedAt = closedAt;
    }

    return prisma.case.update({
      where: { id },
      data: dataToUpdate,
      include: {
        createdBy: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  /**
   * Assigns an investigator to a case.
   */
  async assignCase(id: string, assignedToId: string) {
    return prisma.case.update({
      where: { id },
      data: { assignedToId },
      include: {
        createdBy: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  /**
   * Soft deletes a case record.
   */
  async softDeleteCase(id: string) {
    return prisma.case.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Counts total cases created with a specific prefix for sequential case number generation.
   */
  async countCasesForPrefix(prefix: string): Promise<number> {
    return prisma.case.count({
      where: {
        caseNumber: {
          startsWith: prefix,
        },
      },
    });
  }
}

export const caseRepository = new CaseRepository();
