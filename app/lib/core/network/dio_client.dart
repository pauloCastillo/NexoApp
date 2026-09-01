import 'dart:io' show Platform;

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:nexo_app/core/network/auth_interceptor.dart';

const _secureStorage = FlutterSecureStorage();

Dio createDio() {
  const envUrl = String.fromEnvironment('API_URL');
  final defaultUrl = Platform.isAndroid
      ? 'http://10.0.2.2:8080/api'
      : 'http://localhost:8080/api';
  final baseUrl = envUrl.isNotEmpty ? envUrl : defaultUrl;

  final dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  dio.interceptors.add(AuthInterceptor(dio, _secureStorage));
  // ponytail: log only in debug to avoid leaking tokens/PII (see auditoria #10)
  assert(() {
    dio.interceptors.add(LogInterceptor(requestBody: true, responseBody: true));
    return true;
  }());
  return dio;
}
