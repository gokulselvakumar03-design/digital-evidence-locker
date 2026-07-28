import { EvidenceStatus } from '@prisma/client';

/**
 * Evidence Module Interface Definitions
 * Path: server/src/modules/evidence/evidence.interface.ts
 * Purpose: Defines TypeScript interfaces for Evidence model, query options, and response structures.
 */

export interface IEvidence {
  id: string;
  evidenceNumber: string;
  caseId: string;
  uploadedById: string;
  title: string;
  description: string | null;
  fileName: string;
  originalFileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  storageUrl: string;
  thumbnailUrl: string | null;
  hash: string;
  status: EvidenceStatus;
  tags: string[];
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Optional loaded relations
  case?: {
    id: string;
    caseNumber: string;
    title: string;
  };
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface IPaginatedEvidence {
  evidence: IEvidence[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
