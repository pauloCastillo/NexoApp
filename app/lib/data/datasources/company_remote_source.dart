import 'package:dio/dio.dart';
import 'package:nexo_app/core/network/api_exception.dart';
import 'package:nexo_app/core/network/result.dart';

class CompanyRemoteSource {
  final Dio _dio;
  CompanyRemoteSource(this._dio);

  Future<Result<List<Map<String, dynamic>>>> getPublicCompaniesResult() async {
    try {
      final response = await _dio.get('/companies/public');
      final data = response.data as Map<String, dynamic>;
      return Ok((data['companies'] as List).cast<Map<String, dynamic>>());
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<Map<String, dynamic>>> getCompanyResult() async {
    try {
      final response = await _dio.get('/companies/me');
      return Ok(response.data['company'] as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<Map<String, dynamic>>> updateCompanyResult(Map<String, dynamic> body) async {
    try {
      final response = await _dio.put('/companies', data: body);
      return Ok(response.data['company'] as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  // Backward compat
  Future<List<Map<String, dynamic>>> getPublicCompanies() async {
    final r = await getPublicCompaniesResult();
    if (r is Ok<List<Map<String, dynamic>>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<Map<String, dynamic>> getCompany() async {
    final r = await getCompanyResult();
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<Map<String, dynamic>> updateCompany(Map<String, dynamic> body) async {
    final r = await updateCompanyResult(body);
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }
}
