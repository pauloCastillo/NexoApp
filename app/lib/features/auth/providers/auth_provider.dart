import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/core/network/dio_provider.dart';
import 'package:nexo_app/data/repositories/auth_repository_impl.dart';
import 'package:nexo_app/data/repositories/auth_repository.dart';
import 'package:nexo_app/data/datasources/auth_remote_source.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return AuthRepositoryImpl(AuthRemoteSource(dio));
});