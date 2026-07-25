import 'package:nexo_desktop/core/models/client.dart';

abstract class ClientRepository {
  Future<List<ClientModel>> getAll();
  Future<ClientModel> create(Map<String, dynamic> data);
  Future<ClientModel> update(String id, Map<String, dynamic> data);
  Future<void> delete(String id);
}