import prisma from '../../config/prisma.js';
import { UpdateUserDto, UserQueryDto } from './users.dto.js';
import { Role } from '@prisma/client';

/**
 * Users Data Access Repository
 * Path: server/src/modules/users/users.repository.ts
 * Purpose: Executes Prisma queries for User entities with soft-delete filtering.
 */
export class UserRepository {
  /**
   * Retrieves paginated list of non-deleted users with optional search and role filtering.
   */
  async findAllUsers(query: UserQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortOrder = query.sort === 'asc' ? 'asc' : 'desc';

    const whereClause: any = {
      deletedAt: null,
    };

    if (query.role && Object.values(Role).includes(query.role as Role)) {
      whereClause.role = query.role as Role;
    }

    if (query.search) {
      whereClause.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return { users, total, page, limit };
  }

  /**
   * Finds non-deleted user by unique ID.
   */
  async findUserById(id: string) {
    return prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Finds user by unique email address (including soft-deleted check).
   */
  async findUserByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  /**
   * Updates user profile attributes.
   */
  async updateUser(id: string, dto: UpdateUserDto) {
    const dataToUpdate: any = {};
    if (dto.name !== undefined) dataToUpdate.name = dto.name;
    if (dto.email !== undefined) dataToUpdate.email = dto.email;
    if (dto.role !== undefined && Object.values(Role).includes(dto.role as Role)) {
      dataToUpdate.role = dto.role as Role;
    }

    return prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Soft deletes a user by setting deletedAt timestamp and deactivating.
   */
  async softDeleteUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        deletedAt: true,
      },
    });
  }

  /**
   * Updates user activation status.
   */
  async updateUserStatus(id: string, isActive: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
