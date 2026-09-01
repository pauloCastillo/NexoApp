import 'package:dio/dio.dart';
import 'package:nexo_app/core/network/api_exception.dart';
import 'package:nexo_app/core/network/result.dart';

class BranchRemoteSource {
  final Dio _dio;
  BranchRemoteSource(this._dio);

  Future<Result<List<Map<String, dynamic>>>> getBranchesResult() async {
    try {
      final r = await _dio.get('/branches');
      return Ok((r.data['branches'] as List).cast<Map<String, dynamic>>());
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<Map<String, dynamic>>> createBranchResult(Map<String, dynamic> body) async {
    try {
      final r = await _dio.post('/branches', data: body);
      return Ok(r.data['branch'] as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<Map<String, dynamic>>> updateBranchResult(String id, Map<String, dynamic> body) async {
    try {
      final r = await _dio.put('/branches/$id', data: body);
      return Ok(r.data['branch'] as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<void>> deleteBranchResult(String id) async {
    try {
      await _dio.delete('/branches/$id');
      return Ok(null);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<Map<String, dynamic>>> assignBranchesResult(String employeeId, List<String> branchIds, {String? reason}) async {
    try {
      final r = await _dio.put('/employees/$employeeId/branches', data: {'branchIds': branchIds, if (reason != null) 'reason': reason}); // ignore: use_null_aware_elements
      return Ok(r.data['user'] as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  // compat throwing wrappers
  Future<List<Map<String, dynamic>>> getBranches() async {
    final r = await getBranchesResult();
    if (r is Ok<List<Map<String, dynamic>>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<Map<String, dynamic>> createBranch(Map<String, dynamic> body) async {
    final r = await createBranchResult(body);
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<Map<String, dynamic>> updateBranch(String id, Map<String, dynamic> body) async {
    final r = await updateBranchResult(id, body);
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }
}
