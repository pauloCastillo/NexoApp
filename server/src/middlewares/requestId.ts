import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import logger from '@/utils/logger.js';

export function requestId(req: Request, res: Response, next: NextFunction) {
  const incoming = (req.headers['x-request-id'] as string | undefined)?.trim();
  const isValid = incoming && /^[a-z0-9-]{3,64}$/i.test(incoming);
  const id = isValid ? incoming : randomUUID();
  req.id = id;
  req.log = logger.child({ requestId: id });
  res.setHeader('x-request-id', id);
  next();
}
