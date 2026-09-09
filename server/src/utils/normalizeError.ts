import { ZodError } from 'zod';
import { AppError } from '@/utils/appError.js';
import { catalogEntry } from '@/utils/errorCatalog.js';

function mapMongooseToAppError(err: unknown): AppError | null {
  const e = err as Record<string, unknown> | null;
  if (e?.name === 'ValidationError' && e?.errors) {
    const errors = Object.entries(e.errors as Record<string, { message?: string }>).map(([field, validationErr]) => ({
      field,
      message: validationErr?.message ?? String(validationErr),
    }));
    return new AppError(400, 'VALIDATION_ERROR', catalogEntry('VALIDATION_ERROR').message, { errors });
  }
  if (e?.name === 'CastError') {
    const entry = catalogEntry('INVALID_ID');
    return new AppError(entry.statusCode, 'INVALID_ID', entry.message);
  }
  if (e?.code === 11000 || e?.code === '11000') {
    const entry = catalogEntry('DUPLICATE');
    return new AppError(entry.statusCode, 'DUPLICATE', entry.message);
  }
  return null;
}

export function normalizeError(err: unknown, _requestId?: string): AppError {
  if (err instanceof AppError) return err;

  if (err && typeof err === 'object' && 'statusCode' in err && 'message' in err && !(err instanceof Error)) {
    const e = err as { statusCode: number; message: string; code?: string; errors?: Array<{ field: string; message: string }> };
    const code = e.code ?? (e.statusCode === 404 ? 'NOT_FOUND' : e.statusCode === 409 ? 'DUPLICATE' : e.statusCode === 401 ? 'UNAUTHORIZED' : e.statusCode === 403 ? 'FORBIDDEN' : 'BAD_REQUEST');
    const friendly = e.message;
    return new AppError(e.statusCode, code, friendly, { errors: e.errors });
  }

  if (err instanceof ZodError) {
    const errors = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    return new AppError(400, 'VALIDATION_ERROR', catalogEntry('VALIDATION_ERROR').message, { errors });
  }

  const mongooseMapped = mapMongooseToAppError(err);
  if (mongooseMapped) return mongooseMapped;

  if (err instanceof Error) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      const e = catalogEntry('UNAUTHORIZED');
      return new AppError(e.statusCode, 'UNAUTHORIZED', e.message);
    }

    if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400 && 'body' in err) {
      const e = catalogEntry('BAD_REQUEST');
      return new AppError(e.statusCode, 'BAD_REQUEST', 'Formato de datos inválido.');
    }

    const msg = err.message ?? '';
    if (/Transición inválida|Solo órdenes|No se puede cancelar|WorkOrder not found/i.test(msg)) {
      if (/WorkOrder not found/i.test(msg)) {
        const e = catalogEntry('WORKORDER_NOT_FOUND');
        return new AppError(e.statusCode, 'WORKORDER_NOT_FOUND', e.message);
      }
      const e = catalogEntry('WORKORDER_TRANSITION');
      return new AppError(e.statusCode, 'WORKORDER_TRANSITION', e.message);
    }
    const e = catalogEntry('INTERNAL');
    const appErr = new AppError(e.statusCode, 'INTERNAL', e.message, { technical: msg, isOperational: false });
    appErr.cause = err;
    return appErr;
  }

  const e = catalogEntry('INTERNAL');
  return new AppError(e.statusCode, 'INTERNAL', e.message, { technical: String(err), isOperational: false });
}
