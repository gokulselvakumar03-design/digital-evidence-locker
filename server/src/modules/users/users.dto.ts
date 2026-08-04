/**
 * User Data Transfer Objects (DTOs)
 * Path: server/src/modules/users/users.dto.ts
 * Purpose: DTO contracts for user updates, status changes, and query filters.
 */

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: string;
}

export interface UpdateUserStatusDto {
  isActive: boolean;
}

export interface UserQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sort?: 'asc' | 'desc';
}
