import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_desktop/core/providers/providers.dart';
import 'package:nexo_desktop/core/models/client.dart';
import 'package:nexo_desktop/desktop/features/clients/data/repositories/client_repository_impl.dart';
import 'package:nexo_desktop/desktop/features/clients/domain/repositories/client_repository.dart';
import 'package:nexo_desktop/desktop/features/clients/data/datasources/client_remote_source.dart';

final clientRepositoryProvider = Provider<ClientRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return ClientRepositoryImpl(ClientRemoteSource(dio));
});

final clientListProvider = FutureProvider<List<ClientModel>>((ref) {
  final repo = ref.watch(clientRepositoryProvider);
  return repo.getAll();
});