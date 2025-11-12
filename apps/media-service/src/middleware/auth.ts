// /apps/media-service/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

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
 * Auth-Middleware (Required)
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Gateway setzt diese Headers nach Token-Verification
    const userId = req.headers['x-user-id'] as string;
    const userRole = req.headers['x-user-role'] as string;
    const userPremium = req.headers['x-user-premium'] === 'true';
    
    if (!userId) {
      throw new AppError('UNAUTHORIZED', 401, 'Authentication required');
    }
    
    req.user = {
      id: userId,
      role: userRole,
      premium: userPremium
    };
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional Auth (für Public-Endpoints)
 */
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
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
