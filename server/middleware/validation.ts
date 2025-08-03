import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest = (schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      // Validate query parameters
      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query);
        req.query = parsedQuery as any;
      }

      // Validate route parameters
      if (schema.params) {
        const parsedParams = schema.params.parse(req.params);
        req.params = parsedParams as any;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(new Error('Validation failed'));
      }
    }
  };
};