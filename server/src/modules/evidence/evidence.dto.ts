/**
 * Evidence Data Transfer Objects (DTOs)
 * Path: server/src/modules/evidence/evidence.dto.ts
 * Purpose: Request payloads for evidence uploading, status updating, and SHA-256 integrity verification.
 */

export interface CreateEvidenceDto {
  caseId: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  type?: string;
  sha256Hash: string;
}

export interface VerifyEvidenceHashDto {
  providedSha256Hash: string;
}

export interface EvidenceQueryDto {
  caseId?: string;
  type?: string;
  status?: string;
}
