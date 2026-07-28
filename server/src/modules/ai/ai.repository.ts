import prisma from '../../config/prisma.js';
import { AIQueryDto } from './ai.dto.js';
import { AnalysisType, AnalysisStatus, Prisma } from '@prisma/client';

export interface ICreateAnalysisRepoInput {
  evidenceId: string;
  analysisType: AnalysisType;
  status?: AnalysisStatus;
  requestId?: string | null;
  result?: any;
  summary?: string | null;
  confidence?: number | null;
  processingTime?: number | null;
  createdById: string;
}

export interface IUpdateAnalysisRepoInput {
  status?: AnalysisStatus;
  requestId?: string | null;
  result?: any;
  summary?: string | null;
  confidence?: number | null;
  processingTime?: number | null;
}

const selectIncludes = {
  evidence: {
    select: {
      id: true,
      title: true,
      fileType: true,
      storageUrl: true,
      caseId: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
};

/**
 * AI Analysis Data Access Repository
 * Path: server/src/modules/ai/ai.repository.ts
 * Purpose: Executes Prisma queries for the AIAnalysis table.
 */
export class AIRepository {
  /**
   * Persists an AIAnalysis record.
   */
  async createAnalysis(input: ICreateAnalysisRepoInput) {
    return prisma.aIAnalysis.create({
      data: {
        evidenceId: input.evidenceId,
        analysisType: input.analysisType,
        status: input.status || AnalysisStatus.PENDING,
        requestId: input.requestId || null,
        result: input.result !== undefined ? input.result : Prisma.JsonNull,
        summary: input.summary || null,
        confidence: input.confidence || null,
        processingTime: input.processingTime || null,
        createdById: input.createdById,
      },
      include: selectIncludes,
    });
  }

  /**
   * Finds a single AIAnalysis record by unique ID.
   */
  async findAnalysisById(id: string) {
    return prisma.aIAnalysis.findUnique({
      where: { id },
      include: selectIncludes,
    });
  }

  /**
   * Retrieves paginated AIAnalysis records with filters and sorting.
   */
  async findAnalyses(query: AIQueryDto, userAccessFilter: Prisma.AIAnalysisWhereInput = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    const whereClause: Prisma.AIAnalysisWhereInput = {
      ...userAccessFilter,
    };

    if (query.evidenceId) {
      whereClause.evidenceId = query.evidenceId;
    }

    if (query.analysisType && Object.values(AnalysisType).includes(query.analysisType as AnalysisType)) {
      whereClause.analysisType = query.analysisType as AnalysisType;
    }

    if (query.status && Object.values(AnalysisStatus).includes(query.status as AnalysisStatus)) {
      whereClause.status = query.status as AnalysisStatus;
    }

    let orderBy: Prisma.AIAnalysisOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sort === 'createdAt_asc' || query.sort === 'asc') {
      orderBy = { createdAt: 'asc' };
    }

    const [analyses, total] = await Promise.all([
      prisma.aIAnalysis.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: selectIncludes,
      }),
      prisma.aIAnalysis.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { analyses, total, page, limit, totalPages };
  }

  /**
   * Updates an existing AIAnalysis record.
   */
  async updateAnalysis(id: string, input: IUpdateAnalysisRepoInput) {
    const dataToUpdate: Prisma.AIAnalysisUpdateInput = {};
    if (input.status !== undefined) dataToUpdate.status = input.status;
    if (input.requestId !== undefined) dataToUpdate.requestId = input.requestId;
    if (input.result !== undefined) dataToUpdate.result = input.result;
    if (input.summary !== undefined) dataToUpdate.summary = input.summary;
    if (input.confidence !== undefined) dataToUpdate.confidence = input.confidence;
    if (input.processingTime !== undefined) dataToUpdate.processingTime = input.processingTime;

    return prisma.aIAnalysis.update({
      where: { id },
      data: dataToUpdate,
      include: selectIncludes,
    });
  }

  /**
   * Deletes an AIAnalysis record.
   */
  async deleteAnalysis(id: string) {
    return prisma.aIAnalysis.delete({
      where: { id },
    });
  }
}

export const aiRepository = new AIRepository();
