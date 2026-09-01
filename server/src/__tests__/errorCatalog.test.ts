import { errorCatalog, catalogEntry } from '@/utils/errorCatalog.js';

describe('errorCatalog', () => {
  it('has INTERNAL 500 friendly', () => {
    expect(errorCatalog.INTERNAL.statusCode).toBe(500);
    expect(errorCatalog.INTERNAL.message).toBe('Ocurrió un inconveniente. Intenta de nuevo en unos segundos.');
  });
  it('VALIDATION_ERROR 400', () => {
    expect(catalogEntry('VALIDATION_ERROR').statusCode).toBe(400);
    expect(catalogEntry('VALIDATION_ERROR').message).toBe('Revisa los datos ingresados.');
  });
  it('INVALID_ID 400', () => {
    expect(catalogEntry('INVALID_ID').message).toBe('El identificador no es válido.');
  });
  it('DUPLICATE 409', () => {
    expect(catalogEntry('DUPLICATE').statusCode).toBe(409);
  });
  it('NOT_FOUND 404', () => {
    expect(catalogEntry('NOT_FOUND').statusCode).toBe(404);
  });
  it('UNAUTHORIZED 401', () => {
    expect(catalogEntry('UNAUTHORIZED').statusCode).toBe(401);
  });
  it('FORBIDDEN 403', () => {
    expect(catalogEntry('FORBIDDEN').statusCode).toBe(403);
  });
  it('DB_UNAVAILABLE 503', () => {
    expect(catalogEntry('DB_UNAVAILABLE').statusCode).toBe(503);
  });
  it('WORKORDER_TRANSITION 400', () => {
    expect(catalogEntry('WORKORDER_TRANSITION').statusCode).toBe(400);
  });
  it('fallback to INTERNAL for unknown code', () => {
    expect(catalogEntry('UNKNOWN_CODE')).toBeDefined();
    expect(catalogEntry('UNKNOWN_CODE').statusCode).toBe(500);
  });
  it('messages are non-technical (no stack/code leak)', () => {
    for (const v of Object.values(errorCatalog)) {
      expect(v.message).not.toMatch(/Error|stack|E11000|CastError/i);
    }
  });
  it('all have statusCode and message', () => {
    for (const [, v] of Object.entries(errorCatalog)) {
      expect(typeof v.statusCode).toBe('number');
      expect(typeof v.message).toBe('string');
    }
  });
  it('BAD_REQUEST exists', () => {
    expect(errorCatalog.BAD_REQUEST).toBeDefined();
  });
  it('WORKORDER_NOT_FOUND exists', () => {
    expect(errorCatalog.WORKORDER_NOT_FOUND.statusCode).toBe(404);
  });
  it('INVITATION codes exist', () => {
    expect(errorCatalog.INVITATION_INVALID).toBeDefined();
    expect(errorCatalog.INVITATION_EXPIRED).toBeDefined();
  });
});
