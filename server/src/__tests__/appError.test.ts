import { AppError } from '@/utils/appError.js';

describe('AppError', () => {
  it('creates with statusCode and code', () => {
    const e = new AppError(404, 'NOT_FOUND', 'No encontramos');
    expect(e.statusCode).toBe(404);
    expect(e.code).toBe('NOT_FOUND');
    expect(e.message).toBe('No encontramos');
  });
  it('is instance of Error', () => {
    const e = new AppError(400, 'BAD_REQUEST', 'bad');
    expect(e instanceof Error).toBe(true);
    expect(e instanceof AppError).toBe(true);
    expect(e.name).toBe('AppError');
  });
  it('stores errors array', () => {
    const e = new AppError(400, 'VALIDATION_ERROR', 'Revisa', { errors: [{ field: 'email', message: 'Formato inválido' }] });
    expect(e.errors).toEqual([{ field: 'email', message: 'Formato inválido' }]);
  });
  it('defaults isOperational true', () => {
    expect(new AppError(500, 'INTERNAL', 'x').isOperational).toBe(true);
  });
  it('allows isOperational false', () => {
    expect(new AppError(500, 'INTERNAL', 'x', { isOperational: false }).isOperational).toBe(false);
  });
  it('has stack', () => {
    const e = new AppError(500, 'INTERNAL', 'x');
    expect(e.stack).toBeDefined();
  });
  it('preserves code casing', () => {
    const e = new AppError(409, 'DUPLICATE', 'Ya existe');
    expect(e.code).toBe('DUPLICATE');
  });
  it('message is accessible via err.message', () => {
    const e = new AppError(401, 'UNAUTHORIZED', 'Tu sesión expiró.');
    expect(e.message).toBe('Tu sesión expiró.');
  });
});
