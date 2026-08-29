import 'package:dio/dio.dart';
import 'package:nexo_app/data/models/user_model.dart';

class AuthRemoteSource {
  final Dio _dio;
  AuthRemoteSource(this._dio);

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post(
      '/auth/login',
      data: {'email': email, 'password': password},
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> register(
    String username,
    String email,
    String password, {
    String? companyName,
    String? companyId,
    String? role,
    String? phone,
  }) async {
    final data = <String, dynamic>{
      'username': username,
      'email': email,
      'password': password,
      'confirmPassword': password,
    };
    if (companyName != null) data['companyName'] = companyName;
    if (companyId != null) data['companyId'] = companyId;
    if (role != null) data['role'] = role;
    if (phone != null) data['phone'] = phone;
    final response = await _dio.post('/auth/register', data: data);
    return response.data as Map<String, dynamic>;
  }

  Future<UserModel> getProfile() async {
    final response = await _dio.get('/auth/profile');
    return UserModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> logout() async => _dio.post('/auth/logout');

  Future<void> changePassword(String currentPassword, String newPassword) async {
    await _dio.put('/auth/password', data: {
      'currentPassword': currentPassword,
      'newPassword': newPassword,
    });
  }
}
