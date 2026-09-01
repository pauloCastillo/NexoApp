import { normalizeError } from '@/utils/normalizeError.js';
import { AppError } from '@/utils/appError.js';
import { ZodError } from 'zod';

describe('normalizeError', () => {
  it('passes through AppError', () => {
    const e = new AppError(404, 'NOT_FOUND', 'No');
    expect(normalizeError(e)).toBe(e);
  });
  it('maps legacy {statusCode, message}', () => {
    const err = { statusCode: 404, message: 'Ya existe' } as any;
    const n = normalizeError(err);
    expect(n.statusCode).toBe(404);
    expect(n.code).toBe('NOT_FOUND');
  });
  it('maps legacy 409 to DUPLICATE', () => {
    const n = normalizeError({ statusCode: 409, message: 'dup' } as any);
    expect(n.code).toBe('DUPLICATE');
  });
  it('maps ZodError to VALIDATION_ERROR 400', () => {
    const zodErr = new ZodError([{ code: 'invalid_type', expected: 'string', path: ['email'], message: 'Formato inválido' } as any]);
    const n = normalizeError(zodErr);
    expect(n.statusCode).toBe(400);
    expect(n.code).toBe('VALIDATION_ERROR');
    expect(n.errors?.[0].field).toBe('email');
  });
  it('maps ValidationError', () => {
    const e: any = { name: 'ValidationError', errors: { email: { message: 'required' } } };
    const n = normalizeError(e);
    expect(n.code).toBe('VALIDATION_ERROR');
    expect(n.statusCode).toBe(400);
  });
  it('maps CastError', () => {
    const n = normalizeError({ name: 'CastError' } as any);
    expect(n.code).toBe('INVALID_ID');
  });
  it('maps 11000 duplicate', () => {
    const n = normalizeError({ code: 11000 } as any);
    expect(n.code).toBe('DUPLICATE');
    expect(n.statusCode).toBe(409);
  });
  it('maps JsonWebTokenError to UNAUTHORIZED', () => {
    const n = normalizeError({ name: 'JsonWebTokenError' } as any);
    expect(n.code).toBe('UNAUTHORIZED');
  });
  it('maps workOrder transition Error', () => {
    const n = normalizeError(new Error('Transición inválida de pendiente a completado'));
    expect(n.code).toBe('WORKORDER_TRANSITION');
  });
  it('maps WorkOrder not found', () => {
    const n = normalizeError(new Error('WorkOrder not found'));
    expect(n.code).toBe('WORKORDER_NOT_FOUND');
  });
  it('fallback to INTERNAL for unknown Error', () => {
    const n = normalizeError(new Error('boom'));
    expect(n.code).toBe('INTERNAL');
    expect(n.statusCode).toBe(500);
  });
  it('fallback for plain string', () => {
    const n = normalizeError('oops');
    expect(n.code).toBe('INTERNAL');
  });
});
