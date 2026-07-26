import prisma from '../../config/prisma.js';
import { Role } from '@prisma/client';

export interface ICreateUserRepoInput {
  name: string;
  email: string;
  passwordHash: string;
  role?: Role;
}

/**
 * Authentication Data Access Repository
 * Path: server/src/modules/auth/auth.repository.ts
 * Purpose: Direct database queries via Prisma ORM for User entities.
 */
export class AuthRepository {
  /**
   * Finds a user record by unique email address.
   */
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Finds a user record by unique user ID.
   */
  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Creates a new User record in PostgreSQL via Prisma.
   */
  async createUser(input: ICreateUserRepoInput) {
    const assignedRole = (input.role && Object.values(Role).includes(input.role))
      ? input.role
      : Role.INVESTIGATOR;

    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.passwordHash,
        passwordHash: input.passwordHash,
        role: assignedRole,
      },
    });
  }
}

export const authRepository = new AuthRepository();
