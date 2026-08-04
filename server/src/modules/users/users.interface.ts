/**
 * Users Module Interface Definitions
 * Path: server/src/modules/users/users.interface.ts
 * Purpose: Defines domain interface contracts for user profile operations.
 */

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaginatedUsersResponse {
  users: IUserProfile[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
