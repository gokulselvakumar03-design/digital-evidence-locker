/**
 * Standardized JSON API Response Envelope Utility
 * Path: server/src/utils/apiResponse.ts
 * Purpose: Formats successful HTTP responses consistently across all domain modules.
 */
export class ApiResponse<T = any> {
  public success: boolean;
  public message: string;
  public data: T;
  public statusCode: number;

  constructor(statusCode: number, data: T, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}
