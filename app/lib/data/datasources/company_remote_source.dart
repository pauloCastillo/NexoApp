import 'package:dio/dio.dart';

class CompanyRemoteSource {
  final Dio _dio;
  CompanyRemoteSource(this._dio);

  Future<List<Map<String, dynamic>>> getPublicCompanies() async {
    final response = await _dio.get('/companies/public');
    final data = response.data as Map<String, dynamic>;
    return (data['companies'] as List).cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> getCompany() async {
    final response = await _dio.get('/companies/me');
    return response.data['company'] as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateCompany(Map<String, dynamic> body) async {
    final response = await _dio.put('/companies', data: body);
    return response.data['company'] as Map<String, dynamic>;
  }
}
