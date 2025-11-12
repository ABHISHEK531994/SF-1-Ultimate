// /apps/media-service/src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/errors';

export function validate(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      const errors = error.errors?.map((e: any) => ({
        field: e.path.join('.'),
        message: e.message
      }));
      
      next(new AppError('VALIDATION_ERROR', 400, 'Invalid request data', errors));
    }
  };
}
