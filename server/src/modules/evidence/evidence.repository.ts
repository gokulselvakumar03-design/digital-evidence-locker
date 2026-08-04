import prisma from '../../config/prisma.js';
import { EvidenceQueryDto } from './evidence.dto.js';
import { EvidenceStatus, Prisma } from '@prisma/client';

export interface ICreateEvidenceRepoInput {
  evidenceNumber: string;
  caseId: string;
  uploadedById: string;
  title: string;
  description?: string | null;
  fileName: string;
  originalFileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  storageUrl: string;
  thumbnailUrl?: string | null;
  hash: string;
  status?: EvidenceStatus;
  tags?: string[];
  remarks?: string | null;
}

export interface IUpdateEvidenceRepoInput {
  title?: string;
  description?: string | null;
  tags?: string[];
  remarks?: string | null;
}

/**
 * Evidence Data Access Repository
 * Path: server/src/modules/evidence/evidence.repository.ts
 * Purpose: Executes Prisma queries for the Evidence table with soft-delete support and relational filtering.
 */
export class EvidenceRepository {
  /**
   * Persists a new Evidence record in the database.
   */
  async createEvidence(input: ICreateEvidenceRepoInput) {
    return prisma.evidence.create({
      data: {
        evidenceNumber: input.evidenceNumber,
        caseId: input.caseId,
        uploadedById: input.uploadedById,
        title: input.title,
        description: input.description || null,
        fileName: input.fileName,
        originalFileName: input.originalFileName,
        fileType: input.fileType,
        mimeType: input.mimeType,
        fileSize: input.fileSize,
        storageUrl: input.storageUrl,
        thumbnailUrl: input.thumbnailUrl || null,
        hash: input.hash,
        status: input.status || EvidenceStatus.PENDING,
        tags: input.tags || [],
        remarks: input.remarks || null,
      },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true, role: true } },
        case: { select: { id: true, caseNumber: true, title: true } },
      },
    });
  }

  /**
   * Finds a non-deleted evidence record by ID with relations.
   */
  async findEvidenceById(id: string) {
    return prisma.evidence.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true, role: true } },
        case: { select: { id: true, caseNumber: true, title: true } },
      },
    });
  }

  /**
   * Finds non-deleted evidence records associated with a specific case ID.
   */
  async findEvidenceByCase(caseId: string) {
    return prisma.evidence.findMany({
      where: {
        caseId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true, role: true } },
        case: { select: { id: true, caseNumber: true, title: true } },
      },
    });
  }

  /**
   * Retrieves paginated, filtered evidence records with search, role access filter, and sorting.
   */
  async findAllEvidence(query: EvidenceQueryDto, userAccessFilter: any = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    const whereClause: Prisma.EvidenceWhereInput = {
      deletedAt: null,
      ...userAccessFilter,
    };

    if (query.caseId) {
      whereClause.caseId = query.caseId;
    }

    if (query.status && Object.values(EvidenceStatus).includes(query.status as EvidenceStatus)) {
      whereClause.status = query.status as EvidenceStatus;
    }

    if (query.fileType) {
      whereClause.fileType = { equals: query.fileType, mode: 'insensitive' };
    }

    if (query.uploaderId) {
      whereClause.uploadedById = query.uploaderId;
    }

    if (query.startDate || query.endDate) {
      whereClause.createdAt = {};
      if (query.startDate) {
        whereClause.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        whereClause.createdAt.lte = new Date(query.endDate);
      }
    }

    if (query.search) {
      const searchStr = query.search.trim();
      whereClause.AND = [
        {
          OR: [
            { title: { contains: searchStr, mode: 'insensitive' } },
            { evidenceNumber: { contains: searchStr, mode: 'insensitive' } },
            { description: { contains: searchStr, mode: 'insensitive' } },
            { fileName: { contains: searchStr, mode: 'insensitive' } },
            { originalFileName: { contains: searchStr, mode: 'insensitive' } },
            { tags: { has: searchStr } },
          ],
        },
      ];
    }

    let orderBy: Prisma.EvidenceOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sort === 'createdAt_asc' || query.sort === 'asc') {
      orderBy = { createdAt: 'asc' };
    } else if (query.sort === 'title_asc') {
      orderBy = { title: 'asc' };
    } else if (query.sort === 'fileSize_desc') {
      orderBy = { fileSize: 'desc' };
    }

    const [evidence, total] = await Promise.all([
      prisma.evidence.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: {
          uploadedBy: { select: { id: true, name: true, email: true, role: true } },
          case: { select: { id: true, caseNumber: true, title: true } },
        },
      }),
      prisma.evidence.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { evidence, total, page, limit, totalPages };
  }

  /**
   * Updates fields of an existing evidence record.
   */
  async updateEvidence(id: string, input: IUpdateEvidenceRepoInput) {
    const dataToUpdate: Prisma.EvidenceUpdateInput = {};
    if (input.title !== undefined) dataToUpdate.title = input.title;
    if (input.description !== undefined) dataToUpdate.description = input.description;
    if (input.tags !== undefined) dataToUpdate.tags = input.tags;
    if (input.remarks !== undefined) dataToUpdate.remarks = input.remarks;

    return prisma.evidence.update({
      where: { id },
      data: dataToUpdate,
      include: {
        uploadedBy: { select: { id: true, name: true, email: true, role: true } },
        case: { select: { id: true, caseNumber: true, title: true } },
      },
    });
  }

  /**
   * Soft deletes an evidence record by setting deletedAt timestamp.
   */
  async softDeleteEvidence(id: string) {
    return prisma.evidence.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Updates status of an evidence record.
   */
  async changeEvidenceStatus(id: string, status: EvidenceStatus) {
    return prisma.evidence.update({
      where: { id },
      data: { status },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true, role: true } },
        case: { select: { id: true, caseNumber: true, title: true } },
      },
    });
  }

  /**
   * Finds a non-deleted evidence record by its file SHA-256 hash (to detect duplicate file upload).
   */
  async findEvidenceByHash(hash: string) {
    return prisma.evidence.findFirst({
      where: {
        hash,
        deletedAt: null,
      },
    });
  }

  /**
   * Counts existing evidence items matching a specific evidence number prefix.
   */
  async countEvidenceForPrefix(prefix: string): Promise<number> {
    return prisma.evidence.count({
      where: {
        evidenceNumber: {
          startsWith: prefix,
        },
      },
    });
  }
}

export const evidenceRepository = new EvidenceRepository();
