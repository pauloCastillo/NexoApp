import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { httpStatusCode } from '@/utils/httpStatus.js';

export function validate(schema: ZodSchema, source: 'body' | 'params' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      res.status(httpStatusCode.BAD_REQUEST).json({ message: 'Datos inválidos', errors });
      return;
    }
    req[source] = result.data;
    next();
  };
}
