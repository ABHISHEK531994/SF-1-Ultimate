// /apps/search-service/src/middleware/auth.ts
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

/**
 * Auth-Middleware (required)
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;
  const userPremium = req.headers['x-user-premium'] === 'true';
  
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  req.user = {
    id: userId,
    role: userRole,
    premium: userPremium
  };
  
  next();
}

/**
 * Optional Auth (für Public-Endpoints)
 */
export function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
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
