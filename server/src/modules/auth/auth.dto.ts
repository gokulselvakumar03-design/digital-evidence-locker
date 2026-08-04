/**
 * Authentication Data Transfer Objects (DTOs)
 * Path: server/src/modules/auth/auth.dto.ts
 * Purpose: Defines request and response payload structures for Auth endpoints.
 */

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
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
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
