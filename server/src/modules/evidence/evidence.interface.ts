/**
 * Evidence Module Interface Definitions
 * Path: server/src/modules/evidence/evidence.interface.ts
 * Purpose: Defines interfaces for digital evidence items and cryptographic integrity verification.
 */

export interface IEvidence {
  id: string;
  caseId: string;
  uploadedById: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvidenceHash {
  id: string;
  evidenceId: string;
  sha256Hash: string;
  calculatedAt: Date;
  verifiedById?: string | null;
}
