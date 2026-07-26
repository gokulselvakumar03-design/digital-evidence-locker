/**
 * Users Module Interface Definitions
 * Path: server/src/modules/users/users.interface.ts
 * Purpose: Domain interface contracts for user profile operations.
 */

export interface IUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
