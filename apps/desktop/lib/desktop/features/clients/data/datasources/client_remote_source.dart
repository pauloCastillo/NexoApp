import 'package:dio/dio.dart';
import 'package:nexo_desktop/core/models/client.dart';

class ClientRemoteSource {
  final Dio _dio;
  ClientRemoteSource(this._dio);

  Future<List<ClientModel>> getAll() async {
    final response = await _dio.get('/clients');
    return (response.data as List).map((e) => ClientModel.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<ClientModel> create(Map<String, dynamic> data) async {
    final response = await _dio.post('/clients', data: data);
    return ClientModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<ClientModel> update(String id, Map<String, dynamic> data) async {
    final response = await _dio.put('/clients/$id', data: data);
    return ClientModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> delete(String id) async => _dio.delete('/clients/$id');
}