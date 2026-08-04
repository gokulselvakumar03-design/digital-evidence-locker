import { userRepository } from './users.repository.js';
import { UpdateUserDto, UserQueryDto } from './users.dto.js';
import { IUserProfile, IPaginatedUsersResponse } from './users.interface.js';
import { ApiError } from '../../utils/apiError.js';
import { IJwtPayload } from '../../utils/jwt.helper.js';

/**
 * Users Business Logic Service
 * Path: server/src/modules/users/users.service.ts
 * Purpose: Enforces business logic, authorization boundaries, and duplicate checks for user operations.
 */
export class UserService {
  /**
   * Retrieves paginated, filtered list of all active/non-deleted users (ADMIN only).
   */
  async getAllUsers(query: UserQueryDto): Promise<IPaginatedUsersResponse> {
    const { users, total, page, limit } = await userRepository.findAllUsers(query);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Fetches user profile by ID. Allowed for ADMIN or self.
   */
  async getUserById(id: string, currentUser: IJwtPayload): Promise<IUserProfile> {
    const isSelf = currentUser.userId === id;
    const isAdmin = currentUser.role === 'ADMIN';

    if (!isSelf && !isAdmin) {
      throw new ApiError(403, 'Forbidden: Viewing another user profile requires ADMIN role');
    }

    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  /**
   * Updates profile attributes. Allowed for ADMIN or self (role edits restricted to ADMIN).
   */
  async updateUser(id: string, dto: UpdateUserDto, currentUser: IJwtPayload): Promise<IUserProfile> {
    const isSelf = currentUser.userId === id;
    const isAdmin = currentUser.role === 'ADMIN';

    if (!isSelf && !isAdmin) {
      throw new ApiError(403, 'Forbidden: Updating another user profile requires ADMIN role');
    }

    // Restrict role modification to ADMIN users
    if (dto.role && !isAdmin) {
      throw new ApiError(403, 'Forbidden: Only ADMIN users can change user roles');
    }

    // Verify user existence
    const existingUser = await userRepository.findUserById(id);
    if (!existingUser) {
      throw new ApiError(404, 'User not found');
    }

    // Prevent duplicate emails
    if (dto.email && dto.email.toLowerCase() !== existingUser.email.toLowerCase()) {
      const emailOccupier = await userRepository.findUserByEmail(dto.email);
      if (emailOccupier && emailOccupier.id !== id) {
        throw new ApiError(400, 'Email address is already in use by another account');
      }
    }

    return userRepository.updateUser(id, dto);
  }

  /**
   * Soft deletes a user account (ADMIN only).
   */
  async softDeleteUser(id: string): Promise<void> {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await userRepository.softDeleteUser(id);
  }

  /**
   * Toggles user active/inactive status (ADMIN only).
   */
  async updateUserStatus(id: string, isActive: boolean): Promise<IUserProfile> {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return userRepository.updateUserStatus(id, isActive);
  }
}

export const userService = new UserService();
