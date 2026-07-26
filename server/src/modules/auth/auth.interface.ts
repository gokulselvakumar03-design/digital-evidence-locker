/**
 * Authentication Module Interface Definitions
 * Path: server/src/modules/auth/auth.interface.ts
 * Purpose: Defines domain entity interfaces and contract types for authentication operations.
 */

export interface IAuthUser {
  id: string;
  email: string;
  role: string;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
