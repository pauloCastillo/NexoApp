import 'package:flutter_test/flutter_test.dart';
import 'package:nexo_app/core/auth/role_guards.dart';

void main() {
  test('isAdminLike', () {
    expect(isAdminLike('business_owner'), true);
    expect(isAdminLike('admin'), true);
    expect(isAdminLike('supervisor'), true);
    expect(isAdminLike('hr_manager'), true);
    expect(isAdminLike('employee'), false);
    expect(isAdminLike('support'), false);
  });
  test('isPlatformOnly', () {
    expect(isPlatformOnly('platform_admin'), true);
    expect(isPlatformOnly('support'), true);
    expect(isPlatformOnly('superuser'), true);
    expect(isPlatformOnly('employee'), false);
  });
  test('canApproveVacation', () {
    expect(canApproveVacation('hr_manager'), true);
    expect(canApproveVacation('business_owner'), true);
    expect(canApproveVacation('supervisor'), false);
  });
  test('canEditGeofence', () {
    expect(canEditGeofence('admin'), true);
    expect(canEditGeofence('supervisor'), false);
    expect(canEditGeofence('employee'), false);
  });
}
