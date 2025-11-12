// /apps/gamification-service/src/utils/errors.ts
export class AppError extends Error {
  constructor(public code: string, public statusCode: number, message?: string) {
    super(message || code);
  }
}

export function errorHandler(err: any, req: any, res: any, next: any) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.code, message: err.message });
  }
  console.error('[Error]', err);
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal server error' });
}
