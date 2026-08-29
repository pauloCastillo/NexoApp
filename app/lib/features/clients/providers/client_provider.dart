import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/core/network/dio_provider.dart';
import 'package:nexo_app/data/models/client_model.dart';
import 'package:nexo_app/data/repositories/client_repository_impl.dart';
import 'package:nexo_app/data/repositories/client_repository.dart';
import 'package:nexo_app/data/datasources/client_remote_source.dart';

final clientRepositoryProvider = Provider<ClientRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return ClientRepositoryImpl(ClientRemoteSource(dio));
});

final clientListProvider = FutureProvider<List<ClientModel>>((ref) {
  final repo = ref.watch(clientRepositoryProvider);
  return repo.getAll();
});