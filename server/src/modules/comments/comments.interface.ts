/**
 * Comments Module Interface Definitions
 * Path: server/src/modules/comments/comments.interface.ts
 * Purpose: Defines interfaces for case and evidence discussion comments and replies.
 */

export interface ICommentUser {
  id: string;
  name?: string;
  email: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface IComment {
  id: string;
  content: string;
  caseId: string | null;
  evidenceId: string | null;
  userId: string;
  parentCommentId: string | null;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  user?: ICommentUser;
  replies?: IComment[];
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginatedComments {
  comments: IComment[];
  pagination: IPaginationMeta;
}
