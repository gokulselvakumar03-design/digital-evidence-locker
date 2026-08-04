import bcrypt from 'bcrypt';

/**
 * Password Hashing & Comparison Helper
 * Path: server/src/utils/password.helper.ts
 * Purpose: Secure bcrypt password hashing and comparison routines.
 */
export class PasswordHelper {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hashes plain text password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, PasswordHelper.SALT_ROUNDS);
  }

  /**
   * Compares plain text password against stored hash
   */
  static async comparePassword(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
