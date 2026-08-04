import { AnalysisType, AnalysisStatus, AuditAction, NotificationType } from '@prisma/client';
import { AnalyzeEvidenceDto, SemanticSearchDto, AIQueryDto } from './ai.dto.js';
import { aiRepository } from './ai.repository.js';
import { aiClient } from './ai.client.js';
import { ApiError } from '../../utils/apiError.js';
import { IJwtPayload } from '../../utils/jwt.helper.js';
import { auditService } from '../audit/audit.service.js';
import { notificationService } from '../notifications/notifications.service.js';
import prisma from '../../config/prisma.js';

/**
 * AI Integration Business Logic Service
 * Path: server/src/modules/ai/ai.service.ts
 * Purpose: Orchestrates AI analysis jobs, communicates with external AI client, updates status, and logs audit events.
 */
export class AIService {
  /**
   * Triggers an AI Analysis for an evidence asset based on AnalysisType.
   */
  async analyzeEvidence(dto: AnalyzeEvidenceDto, user: IJwtPayload) {
    // 1. Role authorization check: ADMIN, INVESTIGATOR can trigger AI analysis
    const allowedRoles = ['ADMIN', 'INVESTIGATOR'];
    if (!allowedRoles.includes(user.role)) {
      throw new ApiError(403, 'Forbidden: Only ADMIN and INVESTIGATOR roles can trigger AI analysis');
    }

    // 2. Validate Evidence exists and is non-deleted
    const evidence = await prisma.evidence.findFirst({
      where: { id: dto.evidenceId, deletedAt: null },
    });
    if (!evidence) {
      throw new ApiError(404, 'Evidence asset not found or has been deleted');
    }

    const type = dto.analysisType || AnalysisType.OCR;

    // 3. Create initial PENDING record in DB
    const initialRecord = await aiRepository.createAnalysis({
      evidenceId: evidence.id,
      analysisType: type,
      status: AnalysisStatus.PENDING,
      createdById: user.userId,
    });

    // 4. Record Audit Log: AI Analysis Started
    await auditService.createLog({
      action: AuditAction.AI_ANALYSIS_STARTED,
      entityType: 'EVIDENCE',
      entityId: evidence.id,
      description: `Started ${type} AI analysis on evidence ${evidence.evidenceNumber}`,
      performedById: user.userId,
      newValue: { analysisId: initialRecord.id, analysisType: type },
    });

    // 5. Update status to PROCESSING
    await aiRepository.updateAnalysis(initialRecord.id, { status: AnalysisStatus.PROCESSING });

    // 6. Execute AI Service REST Call via AIClient
    try {
      let aiResult: any;

      switch (type) {
        case AnalysisType.OCR:
          aiResult = await aiClient.performOCR(evidence.storageUrl, dto.options);
          break;
        case AnalysisType.SPEECH_TO_TEXT:
          aiResult = await aiClient.speechToText(evidence.storageUrl, dto.options);
          break;
        case AnalysisType.IMAGE_ANALYSIS:
          aiResult = await aiClient.imageAnalysis(evidence.storageUrl, dto.options);
          break;
        case AnalysisType.VIDEO_ANALYSIS:
          aiResult = await aiClient.videoAnalysis(evidence.storageUrl, dto.options);
          break;
        case AnalysisType.DOCUMENT_SUMMARY:
          aiResult = await aiClient.summarizeDocument(evidence.storageUrl, dto.options);
          break;
        case AnalysisType.ENTITY_EXTRACTION:
          aiResult = await aiClient.entityExtraction(evidence.storageUrl, dto.options);
          break;
        case AnalysisType.SEMANTIC_SEARCH:
          aiResult = await aiClient.semanticSearch(dto.query || evidence.title, evidence.caseId, dto.options);
          break;
        default:
          aiResult = await aiClient.performOCR(evidence.storageUrl, dto.options);
          break;
      }

      // 7. Update status to COMPLETED with AI output
      const completedRecord = await aiRepository.updateAnalysis(initialRecord.id, {
        status: AnalysisStatus.COMPLETED,
        requestId: aiResult.requestId,
        result: aiResult.result,
        summary: aiResult.summary || null,
        confidence: aiResult.confidence || 0.95,
        processingTime: aiResult.processingTime || 0.5,
      });

      // 8. Record Audit Log: AI Analysis Completed
      await auditService.createLog({
        action: AuditAction.AI_ANALYSIS_COMPLETED,
        entityType: 'EVIDENCE',
        entityId: evidence.id,
        description: `Completed ${type} AI analysis on evidence ${evidence.evidenceNumber}`,
        performedById: user.userId,
        newValue: { analysisId: completedRecord.id, confidence: completedRecord.confidence },
      });

      // Notify user of completion
      await notificationService.createNotification({
        title: `AI Analysis Completed: ${type}`,
        message: `${type} analysis completed successfully for evidence '${evidence.title}'.`,
        type: NotificationType.AI_ANALYSIS_COMPLETED,
        userId: user.userId,
        entityType: 'EVIDENCE',
        entityId: evidence.id,
      });

      return completedRecord;
    } catch (error: any) {
      // 9. On failure, update status to FAILED and record audit log
      await aiRepository.updateAnalysis(initialRecord.id, {
        status: AnalysisStatus.FAILED,
        summary: `Analysis failed: ${error?.message || 'Unknown AI error'}`,
      });

      await auditService.createLog({
        action: AuditAction.AI_ANALYSIS_FAILED,
        entityType: 'EVIDENCE',
        entityId: evidence.id,
        description: `Failed ${type} AI analysis on evidence ${evidence.evidenceNumber}: ${error?.message}`,
        performedById: user.userId,
      });

      // Notify user of failure
      await notificationService.createNotification({
        title: `AI Analysis Failed: ${type}`,
        message: `${type} analysis failed for evidence '${evidence.title}': ${error?.message || 'AI service error'}.`,
        type: NotificationType.AI_ANALYSIS_FAILED,
        userId: user.userId,
        entityType: 'EVIDENCE',
        entityId: evidence.id,
      });

      throw error;
    }
  }

  /**
   * Helper wrappers for specific analysis endpoints
   */
  async performOCR(evidenceId: string, user: IJwtPayload) {
    return this.analyzeEvidence({ evidenceId, analysisType: AnalysisType.OCR }, user);
  }

  async speechToText(evidenceId: string, user: IJwtPayload) {
    return this.analyzeEvidence({ evidenceId, analysisType: AnalysisType.SPEECH_TO_TEXT }, user);
  }

  async imageAnalysis(evidenceId: string, user: IJwtPayload) {
    return this.analyzeEvidence({ evidenceId, analysisType: AnalysisType.IMAGE_ANALYSIS }, user);
  }

  async videoAnalysis(evidenceId: string, user: IJwtPayload) {
    return this.analyzeEvidence({ evidenceId, analysisType: AnalysisType.VIDEO_ANALYSIS }, user);
  }

  async summarizeDocument(evidenceId: string, user: IJwtPayload) {
    return this.analyzeEvidence({ evidenceId, analysisType: AnalysisType.DOCUMENT_SUMMARY }, user);
  }

  async entityExtraction(evidenceId: string, user: IJwtPayload) {
    return this.analyzeEvidence({ evidenceId, analysisType: AnalysisType.ENTITY_EXTRACTION }, user);
  }

  async semanticSearch(dto: SemanticSearchDto, user: IJwtPayload) {
    const allowedRoles = ['ADMIN', 'INVESTIGATOR', 'LAWYER'];
    if (!allowedRoles.includes(user.role)) {
      throw new ApiError(403, 'Forbidden: Role does not have permission to execute semantic search');
    }

    const aiResult = await aiClient.semanticSearch(dto.query, dto.caseId);

    // If evidenceId is provided, persist a record
    if (dto.evidenceId) {
      return this.analyzeEvidence(
        { evidenceId: dto.evidenceId, analysisType: AnalysisType.SEMANTIC_SEARCH, query: dto.query },
        user
      );
    }

    return aiResult;
  }

  /**
   * Retrieves single analysis record by ID.
   */
  async getAnalysisById(id: string, _user: IJwtPayload) {
    const analysis = await aiRepository.findAnalysisById(id);
    if (!analysis) {
      throw new ApiError(404, 'AI Analysis record not found');
    }
    return analysis;
  }

  /**
   * Retrieves paginated AI analysis history with filters.
   */
  async getAnalysisHistory(query: AIQueryDto, user: IJwtPayload) {
    const userAccessFilter: any = {};

    if (user.role === 'INVESTIGATOR') {
      userAccessFilter.OR = [
        { createdById: user.userId },
        { evidence: { uploadedById: user.userId } },
        { evidence: { case: { assignedToId: user.userId } } },
      ];
    }

    const { analyses, total, page, limit, totalPages } = await aiRepository.findAnalyses(query, userAccessFilter);

    return {
      analyses,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Retries a failed analysis job.
   */
  async retryAnalysis(id: string, user: IJwtPayload) {
    const existing = await aiRepository.findAnalysisById(id);
    if (!existing) {
      throw new ApiError(404, 'AI Analysis record not found');
    }

    return this.analyzeEvidence(
      { evidenceId: existing.evidenceId, analysisType: existing.analysisType },
      user
    );
  }

  /**
   * Deletes an analysis record (Admin or creator).
   */
  async deleteAnalysis(id: string, user: IJwtPayload) {
    const existing = await aiRepository.findAnalysisById(id);
    if (!existing) {
      throw new ApiError(404, 'AI Analysis record not found');
    }

    if (user.role !== 'ADMIN' && existing.createdById !== user.userId) {
      throw new ApiError(403, 'Forbidden: You can only delete your own AI analysis records');
    }

    return aiRepository.deleteAnalysis(id);
  }
}

export const aiService = new AIService();
