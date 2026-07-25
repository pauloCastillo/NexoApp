import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthInterceptor extends Interceptor {
  final Dio _dio;
  final FlutterSecureStorage _storage;

  AuthInterceptor(this._dio, this._storage);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _storage.read(key: 'access_token');
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      final refreshToken = await _storage.read(key: 'refresh_token');
      if (refreshToken != null) {
        try {
          final response = await _dio.post('/auth/refresh', data: {'refreshToken': refreshToken});
          final newToken = response.data['accessToken'];
          final newRefresh = response.data['refreshToken'];
          await _storage.write(key: 'access_token', value: newToken);
          await _storage.write(key: 'refresh_token', value: newRefresh);

          final opts = err.requestOptions;
          opts.headers['Authorization'] = 'Bearer $newToken';
          final retry = await _dio.fetch(opts);
          handler.resolve(retry);
          return;
        } catch (_) {}
      }
    }
    handler.next(err);
  }
}