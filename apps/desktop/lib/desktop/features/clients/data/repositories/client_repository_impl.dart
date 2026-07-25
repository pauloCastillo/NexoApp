import 'package:nexo_desktop/core/models/client.dart';
import 'package:nexo_desktop/desktop/features/clients/data/datasources/client_remote_source.dart';
import 'package:nexo_desktop/desktop/features/clients/domain/repositories/client_repository.dart';

class ClientRepositoryImpl implements ClientRepository {
  final ClientRemoteSource _source;
  ClientRepositoryImpl(this._source);

  @override
  Future<List<ClientModel>> getAll() => _source.getAll();
  @override
  Future<ClientModel> create(Map<String, dynamic> data) => _source.create(data);
  @override
  Future<ClientModel> update(String id, Map<String, dynamic> data) => _source.update(id, data);
  @override
  Future<void> delete(String id) => _source.delete(id);
}