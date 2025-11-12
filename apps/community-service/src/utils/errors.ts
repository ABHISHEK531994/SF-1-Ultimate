// /apps/community-service/src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message?: string
  ) {
    super(message || code);
    this.name = 'AppError';
  }
}

export function errorHandler(err: any, req: any, res: any, next: any): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message
    });
    return;
  }
  
  console.error('[Error]', err);
  
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Something went wrong'
  });
}
