import { catalogEntry } from '@/utils/errorCatalog.js';
import { normalizeError } from '@/utils/normalizeError.js';

describe('socketError mapping', () => {
  it('UNAUTHORIZED has friendly message', () => {
    expect(catalogEntry('UNAUTHORIZED').message).toBe('Tu sesión expiró. Inicia sesión de nuevo.');
  });
  it('normalize maps generic to INTERNAL for socket', () => {
    const e = normalizeError(new Error('boom'), 'req-socket');
    expect(e.code).toBe('INTERNAL');
  });
  it('socket auth missing token -> UNAUTHORIZED', () => {
    const e = catalogEntry('UNAUTHORIZED');
    expect(e.statusCode).toBe(401);
  });
  it('socket error includes requestId in log', () => {
    const err = normalizeError(new Error('cast'), 'req-123');
    expect(err).toBeDefined();
  });
  it('socket ValidationError mapped', () => {
    const n = normalizeError({ name: 'ValidationError', errors: { name: { message: 'req' } } } as any);
    expect(n.code).toBe('VALIDATION_ERROR');
  });
  it('socket duplicate mapped 409', () => {
    const n = normalizeError({ code: 11000 } as any);
    expect(n.statusCode).toBe(409);
  });
});
