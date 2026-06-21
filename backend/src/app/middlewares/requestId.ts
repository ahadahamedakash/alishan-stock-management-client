import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Extend Express Request type to include id property
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

/**
 * Middleware to generate unique request ID for each request
 * Helps in tracing requests through logs
 */
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = (req.headers['x-request-id'] as string) || uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};
