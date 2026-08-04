import crypto from 'crypto';
import path from 'path';
import 'multer';
import { EvidenceStatus, AuditAction, NotificationType } from '@prisma/client';
import { CreateEvidenceDto, UpdateEvidenceDto, EvidenceQueryDto } from './evidence.dto.js';
import { evidenceRepository } from './evidence.repository.js';
import { cloudinaryService } from './cloudinary.service.js';
import { ApiError } from '../../utils/apiError.js';
import { IJwtPayload } from '../../utils/jwt.helper.js';
import { auditService } from '../audit/audit.service.js';
import { notificationService } from '../notifications/notifications.service.js';
import prisma from '../../config/prisma.js';

const ALLOWED_EXTENSIONS = new Set([
  'pdf',
  'doc',
  'docx',
  'jpg',
  'jpeg',
  'png',
  'mp4',
  'wav',
  'mp3',
  'zip',
]);

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB in bytes

/**
 * Evidence Business Logic Service
 * Path: server/src/modules/evidence/evidence.service.ts
 * Purpose: Enforces evidence chain-of-custody, SHA-256 hashing, duplicate detection, Cloudinary upload, and access controls.
 */
export class EvidenceService {
  /**
   * Uploads and registers a new evidence asset.
   */
  async uploadEvidence(
    dto: CreateEvidenceDto,
    file: Express.Multer.File,
    user: IJwtPayload
  ) {
    if (!file || !file.buffer) {
      throw new ApiError(400, 'Uploaded file buffer is missing');
    }

    // 1. Validate File Size (100 MB max)
    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError(400, 'File size exceeds maximum allowed limit of 100 MB');
    }

    // 2. Validate File Extension
    const originalFileName = file.originalname || 'unnamed_file';
    const ext = path.extname(originalFileName).toLowerCase().replace('.', '');
    if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
      throw new ApiError(
        400,
        `Invalid file type '.${ext}'. Allowed extensions: ${Array.from(ALLOWED_EXTENSIONS).join(', ')}`
      );
    }

    // 3. Validate Case Exists
    const existingCase = await prisma.case.findFirst({
      where: { id: dto.caseId, deletedAt: null },
    });
    if (!existingCase) {
      throw new ApiError(404, 'Associated legal case not found or has been deleted');
    }

    // 4. Validate Uploader Exists
    const uploader = await prisma.user.findFirst({
      where: { id: user.userId, deletedAt: null, isActive: true },
    });
    if (!uploader) {
      throw new ApiError(404, 'Uploader user account not found or is inactive');
    }

    // 5. Automatically Calculate SHA-256 Hash
    const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    // 6. Security Check: Detect Duplicate Evidence via SHA-256 Hash
    const duplicateEvidence = await evidenceRepository.findEvidenceByHash(hash);
    if (duplicateEvidence) {
      throw new ApiError(
        409,
        `Duplicate evidence file detected. File with SHA-256 hash '${hash}' already exists under Evidence ID ${duplicateEvidence.id}`
      );
    }

    // 7. Upload to Cloudinary Storage
    const uploadResult = await cloudinaryService.uploadFile(
      file.buffer,
      originalFileName,
      file.mimetype
    );

    // 8. Generate Unique Evidence Number (e.g. EVD-2026-000001)
    const evidenceNumber = await this.generateEvidenceNumber();

    // 9. Process Tags
    const tagsArray = this.parseTags(dto.tags);

    // 10. Persist Record in Database via Repository
    const createdEvidence = await evidenceRepository.createEvidence({
      evidenceNumber,
      caseId: dto.caseId,
      uploadedById: user.userId,
      title: dto.title,
      description: dto.description || null,
      fileName: `${evidenceNumber}_${originalFileName.replace(/\s+/g, '_')}`,
      originalFileName,
      fileType: ext.toUpperCase(),
      mimeType: file.mimetype,
      fileSize: file.size,
      storageUrl: uploadResult.storageUrl,
      thumbnailUrl: uploadResult.thumbnailUrl,
      hash,
      status: EvidenceStatus.PENDING,
      tags: tagsArray,
    });

    await auditService.createLog({
      action: AuditAction.UPLOAD_EVIDENCE,
      entityType: 'EVIDENCE',
      entityId: createdEvidence.id,
      description: `Uploaded evidence file ${createdEvidence.evidenceNumber}: '${createdEvidence.title}'`,
      performedById: user.userId,
      newValue: { evidenceNumber: createdEvidence.evidenceNumber, hash: createdEvidence.hash },
    });

    if (existingCase.assignedToId && existingCase.assignedToId !== user.userId) {
      await notificationService.createNotification({
        title: `Evidence Uploaded: ${createdEvidence.evidenceNumber}`,
        message: `New evidence '${createdEvidence.title}' uploaded to case '${existingCase.title}'.`,
        type: NotificationType.EVIDENCE_UPLOADED,
        userId: existingCase.assignedToId,
        entityType: 'EVIDENCE',
        entityId: createdEvidence.id,
      });
    }

    return createdEvidence;
  }

  /**
   * Retrieves complete metadata of a single evidence item by ID.
   */
  async getEvidenceById(id: string, _user: IJwtPayload) {
    const evidence = await evidenceRepository.findEvidenceById(id);
    if (!evidence) {
      throw new ApiError(404, 'Evidence record not found or has been deleted');
    }
    return evidence;
  }

  /**
   * Lists all evidence items for a given case.
   */
  async getEvidenceByCase(caseId: string, _user: IJwtPayload) {
    const existingCase = await prisma.case.findFirst({
      where: { id: caseId, deletedAt: null },
    });
    if (!existingCase) {
      throw new ApiError(404, 'Case not found or has been deleted');
    }

    return evidenceRepository.findEvidenceByCase(caseId);
  }

  /**
   * Retrieves paginated, searchable, and filtered evidence list.
   */
  async getAllEvidence(query: EvidenceQueryDto, user: IJwtPayload) {
    const userAccessFilter: any = {};

    // Role-based access filtering
    if (user.role === 'INVESTIGATOR') {
      // Investigators can view evidence from cases assigned to them or created/uploaded by them
      userAccessFilter.OR = [
        { uploadedById: user.userId },
        { case: { assignedToId: user.userId } },
        { case: { createdById: user.userId } },
      ];
    }

    return evidenceRepository.findAllEvidence(query, userAccessFilter);
  }

  /**
   * Updates evidence metadata (title, description, tags, remarks).
   */
  async updateEvidence(id: string, dto: UpdateEvidenceDto, user: IJwtPayload) {
    const existing = await evidenceRepository.findEvidenceById(id);
    if (!existing) {
      throw new ApiError(404, 'Evidence record not found');
    }

    // Role verification: INVESTIGATOR can update their own uploaded evidence
    if (user.role === 'INVESTIGATOR' && existing.uploadedById !== user.userId) {
      throw new ApiError(403, 'Forbidden: You can only update evidence uploaded by yourself');
    }

    const tagsArray = dto.tags !== undefined ? this.parseTags(dto.tags) : undefined;

    const updated = await evidenceRepository.updateEvidence(id, {
      title: dto.title,
      description: dto.description,
      tags: tagsArray,
      remarks: dto.remarks,
    });

    await auditService.createLog({
      action: AuditAction.UPDATE_EVIDENCE,
      entityType: 'EVIDENCE',
      entityId: id,
      description: `Updated evidence metadata for ${existing.evidenceNumber}`,
      performedById: user.userId,
      oldValue: { title: existing.title, description: existing.description },
      newValue: dto,
    });

    return updated;
  }

  /**
   * Updates status of an evidence asset.
   */
  async changeEvidenceStatus(id: string, status: EvidenceStatus, user: IJwtPayload) {
    const existing = await evidenceRepository.findEvidenceById(id);
    if (!existing) {
      throw new ApiError(404, 'Evidence record not found');
    }

    if (!Object.values(EvidenceStatus).includes(status)) {
      throw new ApiError(400, `Invalid evidence status '${status}'`);
    }

    const updated = await evidenceRepository.changeEvidenceStatus(id, status);

    let auditAction: AuditAction = AuditAction.UPDATE_EVIDENCE;
    if (status === EvidenceStatus.VERIFIED) auditAction = AuditAction.VERIFY_EVIDENCE;
    else if (status === EvidenceStatus.APPROVED) auditAction = AuditAction.APPROVE_EVIDENCE;
    else if (status === EvidenceStatus.REJECTED) auditAction = AuditAction.REJECT_EVIDENCE;

    await auditService.createLog({
      action: auditAction,
      entityType: 'EVIDENCE',
      entityId: id,
      description: `Changed status of evidence ${existing.evidenceNumber} from ${existing.status} to ${status}`,
      performedById: user?.userId || existing.uploadedById,
      oldValue: { status: existing.status },
      newValue: { status },
    });

    if (status === EvidenceStatus.APPROVED && existing.uploadedById !== user.userId) {
      await notificationService.createNotification({
        title: `Evidence Approved: ${existing.evidenceNumber}`,
        message: `Your evidence '${existing.title}' has been APPROVED.`,
        type: NotificationType.EVIDENCE_APPROVED,
        userId: existing.uploadedById,
        entityType: 'EVIDENCE',
        entityId: id,
      });
    } else if (status === EvidenceStatus.REJECTED && existing.uploadedById !== user.userId) {
      await notificationService.createNotification({
        title: `Evidence Rejected: ${existing.evidenceNumber}`,
        message: `Your evidence '${existing.title}' has been REJECTED.`,
        type: NotificationType.EVIDENCE_REJECTED,
        userId: existing.uploadedById,
        entityType: 'EVIDENCE',
        entityId: id,
      });
    }

    return updated;
  }

  /**
   * Soft deletes an evidence record.
   */
  async softDeleteEvidence(id: string, user: IJwtPayload) {
    const existing = await evidenceRepository.findEvidenceById(id);
    if (!existing) {
      throw new ApiError(404, 'Evidence record not found');
    }

    if (user.role === 'INVESTIGATOR' && existing.uploadedById !== user.userId) {
      throw new ApiError(403, 'Forbidden: You can only delete evidence uploaded by yourself');
    }

    const deleted = await evidenceRepository.softDeleteEvidence(id);

    await auditService.createLog({
      action: AuditAction.DELETE_EVIDENCE,
      entityType: 'EVIDENCE',
      entityId: id,
      description: `Soft-deleted evidence record ${existing.evidenceNumber}`,
      performedById: user.userId,
    });

    return deleted;
  }

  /**
   * Helper method to generate sequential unique evidence numbers: EVD-YYYY-XXXXXX
   */
  private async generateEvidenceNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `EVD-${currentYear}-`;
    const count = await evidenceRepository.countEvidenceForPrefix(prefix);
    const sequenceNumber = (count + 1).toString().padStart(6, '0');
    return `${prefix}${sequenceNumber}`;
  }

  /**
   * Helper to parse tags input from array, JSON string, or comma-separated string.
   */
  private parseTags(tags?: string[] | string): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags.map((t) => t.trim()).filter(Boolean);
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) return parsed.map((t) => String(t).trim()).filter(Boolean);
      } catch {
        return tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }
    return [];
  }
}

export const evidenceService = new EvidenceService();
