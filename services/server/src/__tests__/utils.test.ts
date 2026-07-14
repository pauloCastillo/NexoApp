import { generateInviteCode } from '@/utils/utils.js';

describe('generateInviteCode', () => {
  it('should return an 8-character uppercase string', () => {
    const code = generateInviteCode();
    expect(code).toMatch(/^[A-F0-9]{8}$/);
  });

  it('should generate unique codes', () => {
    const codes = new Set(Array.from({ length: 100 }, () => generateInviteCode()));
    expect(codes.size).toBe(100);
  });
});
