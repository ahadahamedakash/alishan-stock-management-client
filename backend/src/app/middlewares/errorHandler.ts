import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken';

/**
 * Global error handling middleware
 * Catches all errors and logs them with context
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.id || 'unknown';

  // Log error with context
  logger.error('Unhandled Error', {
    requestId,
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userId: (req as any).user?.userId,
  });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
      requestId,
    });
  }

  // Handle JWT errors
  if (error instanceof JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      requestId,
    });
  }

  if (error instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      requestId,
    });
  }

  if (error instanceof NotBeforeError) {
    return res.status(401).json({
      success: false,
      message: 'Token not yet valid',
      requestId,
    });
  }

  // Handle passport/jwt errors
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      requestId,
    });
  }

  // Mongoose validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: error.message,
      requestId,
    });
  }

  // Mongoose duplicate key errors
  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
      error: 'A record with this information already exists',
      requestId,
    });
  }

  // Mongoose cast errors (invalid ID)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      requestId,
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : error.message,
    requestId,
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
