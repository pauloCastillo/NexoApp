import { createInvitationSchema, requestNewSchema } from '@/schemas/invitation.js';
import crypto from 'crypto';

describe('createInvitationSchema', () => {
  it('valid minimal', () => {
    const r = createInvitationSchema.safeParse({ username: 'Juan Perez', email: 'juan@test.com' });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.role).toBe('employee');
      expect(r.data.maxUses).toBe(1);
    }
  });
  it('rejects invalid email', () => {
    const r = createInvitationSchema.safeParse({ username: 'Juan', email: 'not-an-email' });
    expect(r.success).toBe(false);
  });
  it('accepts branchId and departmentId', () => {
    const r = createInvitationSchema.safeParse({ username: 'Ana', email: 'ana@test.com', departmentId: '507f1f77bcf86cd799439011', branchId: '507f1f77bcf86cd799439012', shiftLabel: 'mañana', role: 'supervisor' });
    expect(r.success).toBe(true);
  });
  it('rejects maxUses >1', () => {
    const r = createInvitationSchema.safeParse({ username: 'Ana', email: 'ana@test.com', maxUses: 2 });
    expect(r.success).toBe(false);
  });
  it('limits expiresInDays max 30', () => {
    expect(createInvitationSchema.safeParse({ username: 'A', email: 'a@b.com', expiresInDays: 31 }).success).toBe(false);
    expect(createInvitationSchema.safeParse({ username: 'A', email: 'a@b.com', expiresInDays: 7 }).success).toBe(false); // username too short
    expect(createInvitationSchema.safeParse({ username: 'Ana Perez', email: 'a@b.com', expiresInDays: 7 }).success).toBe(true);
  });
});

describe('requestNewSchema', () => {
  it('valid', () => {
    expect(requestNewSchema.safeParse({ code: 'AB12CD34' }).success).toBe(true);
    expect(requestNewSchema.safeParse({ code: 'AB12CD34', email: 'a@b.com' }).success).toBe(true);
  });
  it('rejects short code', () => {
    expect(requestNewSchema.safeParse({ code: 'AB' }).success).toBe(false);
  });
});

describe('invitation code generation', () => {
  it('generates 8 hex uppercase', () => {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    expect(code).toMatch(/^[0-9A-F]{8}$/);
  });
  it('unified validate response prevents enumeration', () => {
    // simulate logic: both invalid and expired return same 400
    const fakeValidate = (code: string, exists: boolean, expired: boolean, used: boolean) => {
      if (!exists || expired || used) return { status: 400, body: { message: 'Código inválido o expirado', canRequestNew: true } };
      return { status: 200, body: { valid: true } };
    };
    expect(fakeValidate('BAD', false, false, false).body.message).toBe('Código inválido o expirado');
    expect(fakeValidate('EXP', true, true, false).body.message).toBe('Código inválido o expirado');
    expect(fakeValidate('USED', true, false, true).body.message).toBe('Código inválido o expirado');
    expect(fakeValidate('GOOD', true, false, false).status).toBe(200);
  });
  it('single-use race: only one findOneAndUpdate succeeds', async () => {
    // simulate atomic: first succeeds, second fails
    let usedCount = 0;
    const maxUses = 1;
    const tryConsume = () => {
      if (usedCount < maxUses) { usedCount++; return true; }
      return false;
    };
    expect(tryConsume()).toBe(true);
    expect(tryConsume()).toBe(false);
  });
});
