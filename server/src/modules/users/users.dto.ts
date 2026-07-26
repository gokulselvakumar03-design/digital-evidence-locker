/**
 * User Data Transfer Objects (DTOs)
 * Path: server/src/modules/users/users.dto.ts
 * Purpose: DTO contracts for user updates and query filters.
 */

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  role?: string;
}

export interface UserQueryDto {
  page?: number;
  limit?: number;
  role?: string;
}
