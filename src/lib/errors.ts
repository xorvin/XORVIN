/**
 * Xorvin — Centralized Error Handling
 */

export class AppError extends Error {
  public code: string;
  public status: number;
  public details?: any;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', status: number = 500, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;

  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    const e = error as any;
    // Handle Supabase PostgREST errors
    if (e.code === '23505') {
      return new AppError('A record with this information already exists.', 'DUPLICATE_RECORD', 409, e);
    }
    if (e.code === '23503') {
      return new AppError('Referenced record does not exist.', 'FOREIGN_KEY_VIOLATION', 400, e);
    }
    return new AppError(e.message || 'Database error occurred', e.code || 'DB_ERROR', 500, e);
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'INTERNAL_ERROR', 500);
  }

  return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', 500, error);
};
