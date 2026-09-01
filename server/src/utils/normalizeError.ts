import { ZodError } from 'zod';
import { AppError } from '@/utils/appError.js';
import { catalogEntry } from '@/utils/errorCatalog.js';

function mapMongooseToAppError(err: any): AppError | null {
  // ValidationError: mongoose
  if (err?.name === 'ValidationError' && err?.errors) {
    const errors = Object.entries(err.errors as Record<string, any>).map(([field, e]: [string, any]) => ({
      field,
      message: e?.message ?? String(e),
    }));
    return new AppError(400, 'VALIDATION_ERROR', catalogEntry('VALIDATION_ERROR').message, { errors });
  }
  if (err?.name === 'CastError') {
    const e = catalogEntry('INVALID_ID');
    return new AppError(e.statusCode, 'INVALID_ID', e.message);
  }
  // duplicate key 11000
  if (err?.code === 11000 || err?.code === '11000') {
    const e = catalogEntry('DUPLICATE');
    return new AppError(e.statusCode, 'DUPLICATE', e.message);
  }
  return null;
}

export function normalizeError(err: any, _requestId?: string): AppError {
  if (err instanceof AppError) return err;

  // ponytail: legacy compat — services like authService throw {statusCode, message}; normalize to AppError until migrated
  if (err && typeof err.statusCode === 'number' && typeof err.message === 'string' && !(err instanceof Error)) {
    const code = err.code ?? (err.statusCode === 404 ? 'NOT_FOUND' : err.statusCode === 409 ? 'DUPLICATE' : err.statusCode === 401 ? 'UNAUTHORIZED' : err.statusCode === 403 ? 'FORBIDDEN' : 'BAD_REQUEST');
    // keep friendly if already friendly, else catalog
    const friendly = err.message;
    return new AppError(err.statusCode, code, friendly, { errors: err.errors });
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    return new AppError(400, 'VALIDATION_ERROR', catalogEntry('VALIDATION_ERROR').message, { errors });
  }

  const mongooseMapped = mapMongooseToAppError(err);
  if (mongooseMapped) return mongooseMapped;

  // JWT
  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    const e = catalogEntry('UNAUTHORIZED');
    return new AppError(e.statusCode, 'UNAUTHORIZED', e.message);
  }

  // SyntaxError from express.json
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    const e = catalogEntry('BAD_REQUEST');
    return new AppError(e.statusCode, 'BAD_REQUEST', 'Formato de datos inválido.');
  }

  // plain Error with known friendly substrings (workOrder transitions)
  if (err instanceof Error) {
    const msg = err.message ?? '';
    if (/Transición inválida|Solo órdenes|No se puede cancelar|WorkOrder not found/i.test(msg)) {
      if (/WorkOrder not found/i.test(msg)) {
        const e = catalogEntry('WORKORDER_NOT_FOUND');
        return new AppError(e.statusCode, 'WORKORDER_NOT_FOUND', e.message);
      }
      const e = catalogEntry('WORKORDER_TRANSITION');
      return new AppError(e.statusCode, 'WORKORDER_TRANSITION', e.message);
    }
    // fallback: treat as internal but preserve requestId linkage via caller
    const e = catalogEntry('INTERNAL');
    const appErr = new AppError(e.statusCode, 'INTERNAL', e.message);
    // keep technical for logging via cause
    (appErr as any).cause = err;
    (appErr as any).technical = msg;
    return appErr;
  }

  const e = catalogEntry('INTERNAL');
  const appErr = new AppError(e.statusCode, 'INTERNAL', e.message);
  (appErr as any).technical = String(err);
  return appErr;
}
