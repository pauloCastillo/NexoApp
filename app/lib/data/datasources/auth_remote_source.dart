import 'package:dio/dio.dart';
import 'package:nexo_app/core/network/api_exception.dart';
import 'package:nexo_app/core/network/result.dart';
import 'package:nexo_app/data/models/user_model.dart';

class AuthRemoteSource {
  final Dio _dio;
  AuthRemoteSource(this._dio);

  Future<Result<Map<String, dynamic>>> loginResult(String email, String password) async {
    try {
      final response = await _dio.post('/auth/login', data: {'email': email, 'password': password});
      return Ok(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<Map<String, dynamic>>> registerResult(String username, String email, String password, {String? companyName, String? companyId, String? role, String? phone, String? invitationCode}) async {
    try {
      final data = <String, dynamic>{'username': username, 'email': email, 'password': password, 'confirmPassword': password};
      if (companyName != null) data['companyName'] = companyName;
      if (companyId != null) data['companyId'] = companyId;
      if (role != null) data['role'] = role;
      if (phone != null) data['phone'] = phone;
      if (invitationCode != null) data['invitationCode'] = invitationCode;
      final response = await _dio.post('/auth/register', data: data);
      return Ok(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<Map<String, dynamic>>> validateInvitationResult(String code) async {
    try {
      final res = await _dio.get('/invitations/validate/$code');
      return Ok(res.data as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<Map<String, dynamic>>> requestNewCodeResult(String code, {String? email, String? phone}) async {
    try {
      final res = await _dio.post('/invitations/request-new', data: {'code': code, if (email != null) 'email': email, if (phone != null) 'phone': phone});
      return Ok(res.data as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<UserModel>> getProfileResult() async {
    try {
      final response = await _dio.get('/auth/profile');
      return Ok(UserModel.fromJson(response.data as Map<String, dynamic>));
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  // Backward compat — delegates to Result
  Future<Map<String, dynamic>> login(String email, String password) async {
    final r = await loginResult(email, password);
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<Map<String, dynamic>> register(String username, String email, String password, {String? companyName, String? companyId, String? role, String? phone, String? invitationCode}) async {
    final r = await registerResult(username, email, password, companyName: companyName, companyId: companyId, role: role, phone: phone, invitationCode: invitationCode);
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<Map<String, dynamic>> validateInvitation(String code) async {
    final r = await validateInvitationResult(code);
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<Map<String, dynamic>> requestNewCode(String code, {String? email, String? phone}) async {
    final r = await requestNewCodeResult(code, email: email, phone: phone);
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<UserModel> getProfile() async {
    final r = await getProfileResult();
    if (r is Ok<UserModel>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<void> logout() async => _dio.post('/auth/logout');

  Future<void> changePassword(String currentPassword, String newPassword) async {
    await _dio.put('/auth/password', data: {'currentPassword': currentPassword, 'newPassword': newPassword});
  }
}
