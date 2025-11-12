// /apps/media-service/src/utils/errors.ts

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message?: string,
    public details?: any
  ) {
    super(message || code);
    this.name = 'AppError';
  }
}

export function errorHandler(err: any, req: any, res: any, next: any) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      details: err.details
    });
  }
  
  // Multer Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'FILE_TOO_LARGE',
      message: 'File size exceeds limit'
    });
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      error: 'TOO_MANY_FILES',
      message: 'Too many files uploaded'
    });
  }
  
  // MongoDB Errors
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'DUPLICATE_KEY',
      message: 'Resource already exists'
    });
  }
  
  // Default
  console.error('[Error]', err);
  
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Internal server error'
  });
}
