import 'package:dio/dio.dart';
import 'package:nexo_app/core/network/api_exception.dart';
import 'package:nexo_app/core/network/result.dart';
import 'package:nexo_app/domain/employee/entities/employee_model.dart';

class EmployeeRemoteSource {
  final Dio _dio;
  EmployeeRemoteSource(this._dio);

  // New Result API (preferred)
  Future<Result<List<EmployeeModel>>> getAllResult() async {
    try {
      final response = await _dio.get('/employees');
      final data = response.data;
      if (data is List) {
        return Ok(data.map((e) => EmployeeModel.fromJson(e as Map<String, dynamic>)).toList());
      }
      if (data is Map && data['users'] is List) {
        return Ok((data['users'] as List).map((e) => EmployeeModel.fromJson(e as Map<String, dynamic>)).toList());
      }
      return Err(const Failure(message: 'No pudimos cargar empleados.', code: 'INVALID_RESPONSE'));
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    } catch (e) {
      return Err(Failure(message: 'Ocurrió un inconveniente. Intenta de nuevo.', code: 'INTERNAL', requestId: null));
    }
  }

  Future<Result<EmployeeModel>> getByIdResult(String id) async {
    try {
      final response = await _dio.get('/employees/$id');
      final data = response.data;
      final map = data is Map && data['user'] != null ? data['user'] as Map<String, dynamic> : data as Map<String, dynamic>;
      return Ok(EmployeeModel.fromJson(map));
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<Map<String, dynamic>>> createResult(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/employees', data: data);
      return Ok(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<EmployeeModel>> updateResult(String id, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('/employees/$id', data: data);
      final map = response.data is Map && response.data['user'] != null
          ? response.data['user'] as Map<String, dynamic>
          : response.data as Map<String, dynamic>;
      return Ok(EmployeeModel.fromJson(map));
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<void>> deleteResult(String id) async {
    try {
      await _dio.delete('/employees/$id');
      return const Ok(null);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  // Backward compat — delegates to Result and throws Failure as Exception for existing callers
  Future<List<EmployeeModel>> getAll() async {
    final r = await getAllResult();
    if (r is Ok<List<EmployeeModel>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<EmployeeModel> getById(String id) async {
    final r = await getByIdResult(id);
    if (r is Ok<EmployeeModel>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<Map<String, dynamic>> create(Map<String, dynamic> data) async {
    final r = await createResult(data);
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<EmployeeModel> update(String id, Map<String, dynamic> data) async {
    final r = await updateResult(id, data);
    if (r is Ok<EmployeeModel>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<void> delete(String id) async {
    final r = await deleteResult(id);
    if (r is Ok) return;
    throw Exception((r as Err).failure.message);
  }
}
