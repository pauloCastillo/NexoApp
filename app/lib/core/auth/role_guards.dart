import 'auth_state.dart';

bool isAdminLike(String? role) => adminLikeRoles.contains(role);
bool isPlatformOnly(String? role) => platformOnlyRoles.contains(role);
bool canApproveVacation(String? role) => role == 'hr_manager' || role == 'business_owner';
bool canApprovePermission(String? role) => role == 'hr_manager' || role == 'business_owner';
bool canTransitionWorkOrder(String? role) => role == 'supervisor' || role == 'business_owner';
bool canEditGeofence(String? role) => role == 'business_owner' || role == 'admin' || role == 'platform_admin' || role == 'superuser';
