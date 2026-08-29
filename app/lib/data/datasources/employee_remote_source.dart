import 'package:dio/dio.dart';
import 'package:nexo_app/domain/employee/entities/employee_model.dart';

class EmployeeRemoteSource {
  final Dio _dio;
  EmployeeRemoteSource(this._dio);

  Future<List<EmployeeModel>> getAll() async {
    final response = await _dio.get('/employees');
    final data = response.data;
    if (data is List) {
      return data.map((e) => EmployeeModel.fromJson(e as Map<String, dynamic>)).toList();
    }
    if (data is Map && data['users'] is List) {
      return (data['users'] as List).map((e) => EmployeeModel.fromJson(e as Map<String, dynamic>)).toList();
    }
    throw Exception('Formato inesperado en respuesta de empleados');
  }

  Future<EmployeeModel> getById(String id) async {
    final response = await _dio.get('/employees/$id');
    final data = response.data;
    final map = data is Map && data['user'] != null ? data['user'] as Map<String, dynamic> : data as Map<String, dynamic>;
    return EmployeeModel.fromJson(map);
  }

  Future<Map<String, dynamic>> create(Map<String, dynamic> data) async {
    final response = await _dio.post('/employees', data: data);
    return response.data as Map<String, dynamic>;
  }

  Future<EmployeeModel> update(String id, Map<String, dynamic> data) async {
    final response = await _dio.put('/employees/$id', data: data);
    final map = response.data is Map && response.data['user'] != null
        ? response.data['user'] as Map<String, dynamic>
        : response.data as Map<String, dynamic>;
    return EmployeeModel.fromJson(map);
  }

  Future<void> delete(String id) async => _dio.delete('/employees/$id');
}