import 'express';
import type { Logger } from 'pino';

declare module 'express' {
  interface Request {
    userId?: string;
    companyId?: string;
    userRole?: string;
    id?: string;
    log?: Logger;
  }
}
