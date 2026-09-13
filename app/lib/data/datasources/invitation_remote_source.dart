import 'package:dio/dio.dart';
import 'package:nexo_app/core/network/api_exception.dart';
import 'package:nexo_app/core/network/result.dart';

class InvitationRemoteSource {
  final Dio _dio;
  InvitationRemoteSource(this._dio);

  Future<Result<Map<String, dynamic>>> createResult(
    Map<String, dynamic> body,
  ) async {
    try {
      final r = await _dio.post('/invitations', data: body);
      return Ok(r.data as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<List<Map<String, dynamic>>>> listResult() async {
    try {
      final r = await _dio.get('/invitations');
      final data = r.data is List
          ? r.data as List
          : (r.data['invitations'] as List? ?? r.data as List);
      // server returns array directly or wrapped; handle both
      if (r.data is List) {
        return Ok((r.data as List).cast<Map<String, dynamic>>());
      }
      final list = (data as Map<String, dynamic>);
      if (list.containsKey('invitations')) {
        return Ok((list['invitations'] as List).cast<Map<String, dynamic>>());
      }
      // fallback: server returns mapped list without wrapper? try direct
      return Ok((r.data as List).cast<Map<String, dynamic>>());
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<void>> revokeResult(String code) async {
    try {
      await _dio.delete('/invitations/$code');
      return Ok(null);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<Map<String, dynamic>>> validateResult(String code) async {
    try {
      final r = await _dio.get('/invitations/validate/$code');
      return Ok(r.data as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<Map<String, dynamic>>> requestNewResult(
    String code, {
    String? email,
    String? phone,
  }) async {
    try {
      final r = await _dio.post(
        '/invitations/request-new',
        data: {'code': code, 'email': ?email, 'phone': ?phone},
      );
      return Ok(r.data as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    } // ignore: use_null_aware_elements
  }

  // compat
  Future<Map<String, dynamic>> create(Map<String, dynamic> body) async {
    final r = await createResult(body);
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<List<Map<String, dynamic>>> list() async {
    final r = await listResult();
    if (r is Ok<List<Map<String, dynamic>>>) return r.value;
    throw Exception((r as Err).failure.message);
  }
}
