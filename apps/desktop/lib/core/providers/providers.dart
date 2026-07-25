import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_desktop/core/api/dio_client.dart';

final dioProvider = Provider((_) => createDio());

final authStateProvider = StateProvider<AuthState?>((ref) => null);

class AuthState {
  final String userId;
  final String email;
  final String name;
  final String role;
  final String companyId;

  const AuthState({
    required this.userId,
    required this.email,
    required this.name,
    required this.role,
    required this.companyId,
  });
}