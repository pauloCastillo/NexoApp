import 'package:dio/dio.dart';
import 'package:nexo_app/core/network/api_exception.dart';
import 'package:nexo_app/core/network/result.dart';
import 'package:nexo_app/data/models/client_model.dart';

class ClientRemoteSource {
  final Dio _dio;
  ClientRemoteSource(this._dio);

  Future<Result<List<ClientModel>>> getAllResult() async {
    try {
      final response = await _dio.get('/clients');
      final data = response.data;
      List list;
      if (data is List) {
        list = data;
      } else if (data is Map && data['clients'] is List) {
        list = data['clients'] as List;
      } else {
        return Err(
          const Failure(
            message: 'No pudimos cargar clientes.',
            code: 'INVALID_RESPONSE',
          ),
        );
      }

      return Ok(
        list
            .map((e) => ClientModel.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<ClientModel>> createResult(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/clients', data: data);
      final map = response.data is Map && response.data['client'] != null
          ? response.data['client'] as Map<String, dynamic>
          : response.data as Map<String, dynamic>;
      return Ok(ClientModel.fromJson(map));
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<ClientModel>> updateResult(
    String id,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.put('/clients/$id', data: data);
      final map = response.data is Map && response.data['client'] != null
          ? response.data['client'] as Map<String, dynamic>
          : response.data as Map<String, dynamic>;
      return Ok(ClientModel.fromJson(map));
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<void>> deleteResult(String id) async {
    try {
      await _dio.delete('/clients/$id');
      return const Ok(null);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  // Backward compat
  Future<List<ClientModel>> getAll() async {
    final r = await getAllResult();
    if (r is Ok<List<ClientModel>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<ClientModel> create(Map<String, dynamic> data) async {
    final r = await createResult(data);
    if (r is Ok<ClientModel>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<ClientModel> update(String id, Map<String, dynamic> data) async {
    final r = await updateResult(id, data);
    if (r is Ok<ClientModel>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<void> delete(String id) async {
    final r = await deleteResult(id);
    if (r is Ok) return;
    throw Exception((r as Err).failure.message);
  }
}
