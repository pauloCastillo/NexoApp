import 'package:nexo_app/data/models/client_model.dart';

abstract class ClientRepository {
  Future<List<ClientModel>> getAll();
  Future<ClientModel> create(Map<String, dynamic> data);
  Future<ClientModel> update(String id, Map<String, dynamic> data);
  Future<void> delete(String id);
}