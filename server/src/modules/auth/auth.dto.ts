/**
 * Authentication Data Transfer Objects (DTOs)
 * Path: server/src/modules/auth/auth.dto.ts
 * Purpose: Defines input request structures for registration, login, and token handling.
 */

export interface RegisterUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
