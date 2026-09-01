import request from 'supertest';
import express from 'express';
import { requestId } from '@/middlewares/requestId.js';
import { proxyController } from '@/utils/proxyController.js';
import { normalizeError } from '@/utils/normalizeError.js';
import { catalogEntry } from '@/utils/errorCatalog.js';
import logger from '@/utils/logger.js';

// Helper to create a minimal app with proxied handlers for integration
function makeApp() {
  const app = express();
  app.use(express.json());
  app.use(requestId);

  // 400 via ValidationError
  const validationHandler = async (_req: any, _res: any) => {
    const e: any = new Error('validation');
    e.name = 'ValidationError';
    e.errors = { email: { message: 'Formato inválido' } };
    throw e;
  };
  // 400 via CastError
  const castHandler = async (_req: any, _res: any) => {
    const e: any = new Error('cast');
    e.name = 'CastError';
    throw e;
  };
  // 409 via 11000
  const dupHandler = async (_req: any, _res: any) => {
    const e: any = new Error('dup');
    e.code = 11000;
    e.keyValue = { email: 'a@b.com' };
    throw e;
  };
  // 500 generic
  const internalHandler = async (_req: any, _res: any) => {
    throw new Error('boom');
  };

  const proxied = proxyController({
    validationHandler,
    castHandler,
    dupHandler,
    internalHandler,
  } as any);

  app.get('/test/validation', proxied.validationHandler);
  app.get('/test/cast', proxied.castHandler);
  app.get('/test/dup', proxied.dupHandler);
  app.get('/test/internal', proxied.internalHandler);

  // 404 fallback
  app.use((req: any, res: any) => {
    const rid = (req as any).id;
    const e = catalogEntry('NOT_FOUND');
    res.status(e.statusCode).json({ message: e.message, code: 'NOT_FOUND', requestId: rid });
  });
  // safety net
  app.use((err: any, req: any, res: any, _next: any) => {
    const rid = (req as any).id;
    const appErr = normalizeError(err, rid);
    const log = (req as any).log ?? logger.child({ requestId: rid });
    log.error({ err, code: appErr.code, requestId: rid }, 'Unhandled');
    const isDev = process.env.DEV_STATUS === 'development';
    res.status(appErr.statusCode).json({
      message: appErr.message,
      code: appErr.code,
      requestId: rid,
      ...(appErr.errors && { errors: appErr.errors }),
      ...(isDev && { debug: { technical: String(err), stack: err?.stack } }),
    });
  });

  return app;
}

describe('errorIntegration (supertest)', () => {
  const app = makeApp();

  it('ValidationError → 400 with code VALIDATION_ERROR and requestId + errors', async () => {
    const res = await request(app).get('/test/validation').set('x-request-id', 'req-int-1');
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.message).toBe('Revisa los datos ingresados.');
    expect(res.body.requestId).toBe('req-int-1');
    expect(res.headers['x-request-id']).toBe('req-int-1');
    expect(res.body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'email' })]));
  });

  it('CastError → 400 INVALID_ID with friendly message', async () => {
    const res = await request(app).get('/test/cast');
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('INVALID_ID');
    expect(res.body.message).toBe('El identificador no es válido.');
    expect(res.body.requestId).toBeDefined();
    expect(res.headers['x-request-id']).toBe(res.body.requestId);
  });

  it('11000 duplicate → 409 DUPLICATE', async () => {
    const res = await request(app).get('/test/dup');
    expect(res.status).toBe(409);
    expect(res.body.code).toBe('DUPLICATE');
    expect(res.body.message).toBe('Ya existe un registro con esos datos.');
  });

  it('generic → 500 INTERNAL without debug in prod', async () => {
    const prev = process.env.DEV_STATUS;
    process.env.DEV_STATUS = 'production';
    const res = await request(app).get('/test/internal');
    expect(res.status).toBe(500);
    expect(res.body.code).toBe('INTERNAL');
    expect(res.body.message).toBe('Ocurrió un inconveniente. Intenta de nuevo en unos segundos.');
    expect(res.body.debug).toBeUndefined();
    process.env.DEV_STATUS = prev;
  });

  it('generic → 500 with debug in development', async () => {
    const prev = process.env.DEV_STATUS;
    process.env.DEV_STATUS = 'development';
    const res = await request(app).get('/test/internal');
    expect(res.status).toBe(500);
    expect(res.body.debug).toBeDefined();
    expect(res.body.debug.technical).toBeDefined();
    process.env.DEV_STATUS = prev;
  });

  it('404 fallback returns NOT_FOUND with requestId', async () => {
    const res = await request(app).get('/nope').set('x-request-id', 'req-404');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('NOT_FOUND');
    expect(res.body.requestId).toBe('req-404');
  });

  it('propagates incoming x-request-id to response header', async () => {
    const res = await request(app).get('/test/cast').set('x-request-id', 'my-trace-123');
    expect(res.headers['x-request-id']).toBe('my-trace-123');
    expect(res.body.requestId).toBe('my-trace-123');
  });

  it('generates requestId when not provided', async () => {
    const res = await request(app).get('/test/cast');
    expect(res.body.requestId).toBeDefined();
    expect(typeof res.body.requestId).toBe('string');
    expect(res.headers['x-request-id']).toBe(res.body.requestId);
  });
});
