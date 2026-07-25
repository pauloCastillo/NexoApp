import 'package:dio/dio.dart';
import 'package:nexo_desktop/core/models/employee.dart';

class EmployeeRemoteSource {
  final Dio _dio;
  EmployeeRemoteSource(this._dio);

  Future<List<EmployeeModel>> getAll() async {
    final response = await _dio.get('/employees');
    return (response.data as List).map((e) => EmployeeModel.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<EmployeeModel> getById(String id) async {
    final response = await _dio.get('/employees/$id');
    return EmployeeModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<EmployeeModel> create(Map<String, dynamic> data) async {
    final response = await _dio.post('/employees', data: data);
    return EmployeeModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<EmployeeModel> update(String id, Map<String, dynamic> data) async {
    final response = await _dio.put('/employees/$id', data: data);
    return EmployeeModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> delete(String id) async => _dio.delete('/employees/$id');
}