export type UserRole = 'VICTIM' | 'LAWYER' | 'INVESTIGATOR' | 'POLICE_OFFICER' | 'JUDGE' | 'ADMIN';

export type CaseStatus = 'OPEN' | 'ACTIVE' | 'PENDING_REVIEW' | 'CLOSED';
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EvidenceType = 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';

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
  caseId: string;
  title: string;
  description?: string;
  type: EvidenceType;
  uploadedAt: string;
  sizeLabel: string;
  status: 'VERIFIED' | 'PENDING_REVIEW' | 'REJECTED';
  hash?: string;
  uploadedBy?: string;
  reviewStatus?: string;
  integrityStatus?: string;
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

export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  evidenceFiles: number;
  pendingReviews: number;
}
