export type UserRole = 'VICTIM' | 'LAWYER' | 'INVESTIGATOR' | 'POLICE_OFFICER' | 'JUDGE' | 'ADMIN';

export type CaseStatus = 'OPEN' | 'ACTIVE' | 'PENDING_REVIEW' | 'CLOSED';
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EvidenceType = 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'SCREENSHOT' | 'EMAIL' | 'OTHER';
export type IntegrityStatus = 'VERIFIED' | 'PENDING' | 'FAILED' | 'FLAGGED';
export type ReviewStatus = 'REVIEWED' | 'PENDING_REVIEW' | 'FLAGGED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  evidenceCount: number;
  type?: string;
  assignedInvestigator?: string;
  assignedLawyer?: string;
  client?: string;
  incidentDate?: string;
  incidentLocation?: string;
  tags?: string[];
  notes?: string;
}

export interface CaseTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  permission: string;
}

export interface CaseTimelineEvent {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  actor: string;
}

export interface Evidence {
  id: string;
  evidenceNumber: string;
  caseId: string;
  title: string;
  description?: string;
  type: EvidenceType;
  fileName: string;
  fileSize: string;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  collectedAt?: string;
  location?: string;
  source?: string;
  tags?: string[];
  integrityStatus: IntegrityStatus;
  reviewStatus: ReviewStatus;
  sha256Hash?: string;
  hash?: string;
  status?: 'VERIFIED' | 'PENDING_REVIEW' | 'REJECTED';
  uploadedByRole?: string;
}

export interface CustodyEvent {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  date: string;
  time: string;
  location?: string;
}

export interface AIAnalysis {
  id: string;
  ocrResult: string;
  speechTranscript: string;
  category: string;
  summary: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
}

export interface Activity {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  actor: string;
}

export interface CommentItem {
  id: string;
  author: string;
  role: string;
  message: string;
  timestamp: string;
}

export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  evidenceFiles: number;
  pendingReviews: number;
}
