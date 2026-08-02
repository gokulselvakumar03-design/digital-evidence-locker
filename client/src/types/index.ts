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

export type TimelineEventType = 'CASE' | 'EVIDENCE' | 'INTEGRITY' | 'CUSTODY' | 'REVIEW' | 'COMMENT' | 'SECURITY';
export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CASE_CREATED'
  | 'CASE_UPDATED'
  | 'CASE_STATUS_CHANGED'
  | 'EVIDENCE_UPLOADED'
  | 'EVIDENCE_VIEWED'
  | 'EVIDENCE_DOWNLOADED'
  | 'EVIDENCE_SHARED'
  | 'INTEGRITY_VERIFIED'
  | 'REVIEW_REQUESTED'
  | 'COMMENT_ADDED';
export type SecuritySeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface AuditEvent {
  id: string;
  type: TimelineEventType;
  action: AuditAction;
  title: string;
  description: string;
  timestamp: string;
  user: string;
  role: string;
  caseId?: string;
  evidenceId?: string;
  ipAddress?: string;
  device?: string;
  location?: string;
  severity?: SecuritySeverity;
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

export type NotificationCategory = 'ALL' | 'UNREAD' | 'CASE_UPDATES' | 'EVIDENCE' | 'TIMELINE' | 'SECURITY' | 'AI_ANALYSIS' | 'SYSTEM';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT' | 'CASE' | 'EVIDENCE' | 'TIMELINE' | 'SECURITY' | 'AI_ANALYSIS' | 'SYSTEM';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  description?: string;
  createdAt: string;
  read: boolean;
  type: NotificationType;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  caseId?: string;
  evidenceId?: string;
  actionUrl?: string;
  user?: string;
}

export interface Notification extends NotificationItem {
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  description: string;
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
