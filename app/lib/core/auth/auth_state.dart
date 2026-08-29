import 'package:flutter_riverpod/flutter_riverpod.dart';

const adminLikeRoles = {'business_owner', 'admin', 'supervisor', 'hr_manager', 'platform_admin', 'superuser'};
const platformOnlyRoles = {'platform_admin', 'support', 'superuser'};

class AuthState {
  final String? userId;
  final String? email;
  final String? name;
  final String? role;
  final String? companyId;
  final String? departmentId;

  const AuthState({this.userId, this.email, this.name, this.role, this.companyId, this.departmentId});

  bool get isEmployee => role == 'employee';
  bool get isAdminLike => adminLikeRoles.contains(role);
  bool get isHrManager => role == 'hr_manager' || role == 'business_owner';
  bool get isSupervisor => role == 'supervisor';
  bool get isPlatformOnly => platformOnlyRoles.contains(role);

  AuthState copyWith({String? userId, String? email, String? name, String? role, String? companyId, String? departmentId}) {
    return AuthState(
      userId: userId ?? this.userId,
      email: email ?? this.email,
      name: name ?? this.name,
      role: role ?? this.role,
      companyId: companyId ?? this.companyId,
      departmentId: departmentId ?? this.departmentId,
    );
  }
}

final authStateProvider = StateProvider<AuthState?>((_) => null);