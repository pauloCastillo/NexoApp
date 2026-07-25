import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:nexo_desktop/core/api/auth_interceptor.dart';

const _secureStorage = FlutterSecureStorage();

Dio createDio() {
  final dio = Dio(BaseOptions(
    baseUrl: const String.fromEnvironment('API_URL', defaultValue: 'http://localhost:3000/api'),
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    headers: {'Content-Type': 'application/json'},
  ));

  dio.interceptors.add(AuthInterceptor(dio, _secureStorage));
  dio.interceptors.add(LogInterceptor(requestBody: true, responseBody: true));
  return dio;
}