import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { JwtPayload } from '../types';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    throw new UnauthorizedError('Authorization header is required');
  }

  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
};

export const requireMaintainer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  if (req.user.role !== 'maintainer') {
    throw new ForbiddenError('Maintainer access required');
  }

  next();
};
