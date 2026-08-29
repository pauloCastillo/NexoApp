import { isAdminLike } from '@/middlewares/tenantGuard.js';
describe('role guards', () => {
  test('isAdminLike', () => {
    expect(isAdminLike('business_owner')).toBe(true);
    expect(isAdminLike('employee')).toBe(false);
    expect(isAdminLike('platform_admin')).toBe(true);
  });
});
