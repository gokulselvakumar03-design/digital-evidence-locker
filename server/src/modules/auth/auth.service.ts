import { authRepository } from './auth.repository.js';
import { RegisterUserDto, LoginUserDto, AuthResponseDto } from './auth.dto.js';
import { IUserProfileResponse } from './auth.interface.js';
import { PasswordHelper } from '../../utils/password.helper.js';
import { JwtHelper } from '../../utils/jwt.helper.js';
import { ApiError } from '../../utils/apiError.js';
import { Role } from '@prisma/client';

/**
 * Authentication Business Logic Service
 * Path: server/src/modules/auth/auth.service.ts
 * Purpose: Contains authentication algorithms, validation checks, hashing, and token handling.
 */
export class AuthService {
  /**
   * Registers a new user account.
   */
  async register(dto: RegisterUserDto): Promise<AuthResponseDto> {
    // 1. Check duplicate email
    const existingUser = await authRepository.findUserByEmail(dto.email);
    if (existingUser) {
      throw new ApiError(400, 'Email address is already registered');
    }

    // 2. Hash password using bcrypt
    const hashedPassword = await PasswordHelper.hashPassword(dto.password);

    // 3. Create user in database
    const userRole = (dto.role as Role) || Role.INVESTIGATOR;
    const user = await authRepository.createUser({
      name: dto.name,
      email: dto.email,
      passwordHash: hashedPassword,
      role: userRole,
    });

    // 4. Generate JWT Access Token
    const token = JwtHelper.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. Return token and user information
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  /**
   * Authenticates user login credentials.
   */
  async login(dto: LoginUserDto): Promise<AuthResponseDto> {
    // 1. Find user by email
    const user = await authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 2. Check if user account is active
    if (!user.isActive) {
      throw new ApiError(403, 'User account has been deactivated');
    }

    // 3. Compare password hash (using password or passwordHash field)
    const storedHash = user.password || user.passwordHash;
    const isPasswordValid = await PasswordHelper.comparePassword(dto.password, storedHash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 4. Generate JWT Access Token
    const token = JwtHelper.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. Return token and user profile
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  /**
   * Fetches logged-in user profile by ID.
   */
  async getProfile(userId: string): Promise<IUserProfileResponse> {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new ApiError(404, 'User profile not found');
    }
    return user;
  }
}

export const authService = new AuthService();
