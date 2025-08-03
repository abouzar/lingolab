import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class ValidationError extends Error {
  statusCode = 400;
  isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  isOperational = true;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401;
  isOperational = true;

  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Handle Zod validation errors
  if (error.name === 'ZodError' || error instanceof ZodError) {
    const validationErrors = [];
    
    // Try to extract errors from different possible properties
    const issues = error.issues || error.errors || error._errors || [];
    
    if (Array.isArray(issues)) {
      for (const issue of issues) {
        validationErrors.push({
          field: Array.isArray(issue.path) ? issue.path.join('.') : 'unknown',
          message: issue.message || 'Validation error',
          code: issue.code || 'invalid'
        });
      }
    }

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: validationErrors,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Handle operational errors
  if (error.isOperational) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: {
        code: error.name.toUpperCase(),
        message: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Handle programming errors (don't leak error details in production)
  console.error('Programming Error:', error);
  
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong' 
        : error.message,
      timestamp: new Date().toISOString()
    }
  });
};