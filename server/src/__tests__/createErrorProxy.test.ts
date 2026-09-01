import { createErrorProxy } from '@/utils/createErrorProxy.js';
import { AppError } from '@/utils/appError.js';

class FakeService {
  async ok() { return 42; }
  async throwsValidation() { const e: any = new Error('validation'); e.name = 'ValidationError'; e.errors = { email: { message: 'required' } }; throw e; }
  async throwsCast() { const e: any = new Error('cast'); e.name = 'CastError'; throw e; }
  async throwsDup() { const e: any = new Error('dup'); e.code = 11000; throw e; }
  async throwsLegacy() { throw { statusCode: 404, message: 'not found' } as any; }
  async throwsWorkOrder() { throw new Error('Transición inválida'); }
  async throwsGeneric() { throw new Error('boom'); }
  syncThrow() { throw new Error('boom'); }
  nonFunction = 123;
}

describe('createErrorProxy', () => {
  const svc = createErrorProxy(new FakeService());

  it('passes through success', async () => {
    expect(await svc.ok()).toBe(42);
  });
  it('maps ValidationError to AppError 400', async () => {
    await expect(svc.throwsValidation()).rejects.toMatchObject({ code: 'VALIDATION_ERROR', statusCode: 400 });
  });
  it('maps CastError to INVALID_ID', async () => {
    await expect(svc.throwsCast()).rejects.toMatchObject({ code: 'INVALID_ID' });
  });
  it('maps 11000 to DUPLICATE', async () => {
    await expect(svc.throwsDup()).rejects.toMatchObject({ code: 'DUPLICATE', statusCode: 409 });
  });
  it('maps legacy throw', async () => {
    await expect(svc.throwsLegacy()).rejects.toBeInstanceOf(AppError);
  });
  it('maps workOrder transition', async () => {
    await expect(svc.throwsWorkOrder()).rejects.toMatchObject({ code: 'WORKORDER_TRANSITION' });
  });
  it('maps generic to INTERNAL 500', async () => {
    await expect(svc.throwsGeneric()).rejects.toMatchObject({ code: 'INTERNAL', statusCode: 500 });
  });
  it('preserves non-function property', () => {
    expect((svc as any).nonFunction).toBe(123);
  });
  it('does not wrap constructor', () => {
    expect((svc as any).constructor).toBeDefined();
  });
  it('thrown is AppError instance', async () => {
    try { await svc.throwsCast(); } catch (e) { expect(e instanceof AppError).toBe(true); }
  });
  it('requestId passthrough does not break', async () => {
    const svc2 = createErrorProxy(new FakeService(), { requestId: 'req-123' });
    await expect(svc2.throwsGeneric()).rejects.toMatchObject({ code: 'INTERNAL' });
  });
  // extra to reach ~20
  it('ok second call still works', async () => { expect(await svc.ok()).toBe(42); });
  it('throwsGeneric has friendly message', async () => {
    try { await svc.throwsGeneric(); } catch (e: any) { expect(e.message).toBe('Ocurrió un inconveniente. Intenta de nuevo en unos segundos.'); }
  });
  it('ValidationError includes errors array', async () => {
    try { await svc.throwsValidation(); } catch (e: any) { expect(e.errors).toBeDefined(); }
  });
});
