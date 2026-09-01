import { Request, Response, NextFunction } from 'express';
import { normalizeError } from '@/utils/normalizeError.js';
import { catalogEntry } from '@/utils/errorCatalog.js';
import logger from '@/utils/logger.js';

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export function proxyController(handlers: Record<string, Handler>): Record<string, Handler> {
  const proxied: Record<string, Handler> = {};
  for (const [name, fn] of Object.entries(handlers)) {
    proxied[name] = async (req: Request, res: Response, _next: NextFunction) => {
      try {
        await fn(req, res, _next);
      } catch (e: unknown) {
        const requestId = (req as any).id as string | undefined;
        const appErr = normalizeError(e, requestId);
        const entry = catalogEntry(appErr.code);
        // friendly message from catalog if code matches, else appErr.message (already friendly)
        const message = appErr.message || entry.message;
        const log = (req as any).log ?? logger.child({ requestId });
        log.error({ err: e, code: appErr.code, statusCode: appErr.statusCode, requestId, technical: (appErr as any).technical ?? (e instanceof Error ? e.message : String(e)) }, 'request failed');
        const isDev = process.env.DEV_STATUS === 'development';
        res.status(appErr.statusCode).json({
          message,
          code: appErr.code,
          requestId,
          ...(appErr.errors && { errors: appErr.errors }),
          ...(isDev && { debug: { technical: (appErr as any).technical ?? (e instanceof Error ? e.message : String(e)), stack: (e instanceof Error ? e.stack : undefined) } }),
        });
      }
    };
  }
  return proxied;
}

// Helper to wrap single handler for route usage without object
export function wrapHandler(fn: Handler): Handler {
  return proxyController({ fn }).fn;
}
