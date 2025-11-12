// /apps/gamification-service/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';

export interface AuthUser {
  id: string;
  role: string;
  premium: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) return next(new Error('UNAUTHORIZED'));
  req.user = {
    id: userId,
    role: req.headers['x-user-role'] as string,
    premium: req.headers['x-user-premium'] === 'true'
  };
  next();
}

export async function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.headers['x-user-id'] as string;
  if (userId) {
    req.user = {
      id: userId,
      role: req.headers['x-user-role'] as string,
      premium: req.headers['x-user-premium'] === 'true'
    };
  }
  next();
}
