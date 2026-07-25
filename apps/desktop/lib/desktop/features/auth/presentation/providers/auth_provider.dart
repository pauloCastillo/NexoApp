import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_desktop/core/providers/providers.dart';
import 'package:nexo_desktop/desktop/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:nexo_desktop/desktop/features/auth/domain/repositories/auth_repository.dart';
import 'package:nexo_desktop/desktop/features/auth/data/datasources/auth_remote_source.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return AuthRepositoryImpl(AuthRemoteSource(dio));
});