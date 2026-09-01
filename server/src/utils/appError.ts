export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;
  public errors?: Array<{ field: string; message: string }>;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    opts?: { errors?: Array<{ field: string; message: string }>; isOperational?: boolean }
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = opts?.isOperational ?? true;
    this.errors = opts?.errors;
    Error.captureStackTrace?.(this, AppError);
  }
}
