/**
 * Authentication Module Interface Definitions
 * Path: server/src/modules/auth/auth.interface.ts
 * Purpose: Defines domain entity interfaces and contract types for authentication operations.
 */

export interface IUserProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
