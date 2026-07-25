import 'package:dio/dio.dart';
import 'package:nexo_desktop/core/models/user.dart';

class AuthRemoteSource {
  final Dio _dio;
  AuthRemoteSource(this._dio);

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post('/auths/login', data: {
      'email': email,
      'password': password,
    });
    return response.data as Map<String, dynamic>;
  }

  Future<UserModel> getProfile() async {
    final response = await _dio.get('/auths/profile');
    return UserModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> logout() async => _dio.post('/auths/logout');
}