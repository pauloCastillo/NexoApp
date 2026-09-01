import 'dart:async';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthInterceptor extends Interceptor {
  final Dio _dio;
  final FlutterSecureStorage _storage;
  Dio? _refreshDio;
  bool _isRefreshing = false;
  Completer<String?>? _refreshCompleter;

  AuthInterceptor(this._dio, this._storage);

  Dio get _dioForRefresh {
    _refreshDio ??= Dio(_dio.options);
    return _refreshDio!;
  }

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _storage.read(key: 'access_token');
    if (token != null) options.headers['Authorization'] = 'Bearer $token';
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    final status = err.response?.statusCode;
    final opts = err.requestOptions;
    final alreadyRetried = opts.extra['retried'] == true;
    final isRefreshCall = opts.path.contains('/auth/refresh');

    if (status != 401 || alreadyRetried || isRefreshCall) {
      handler.next(err);
      return;
    }

    // queue while refresh in progress
    if (_isRefreshing) {
      try {
        final newToken = await _refreshCompleter!.future;
        if (newToken != null) {
          opts.headers['Authorization'] = 'Bearer $newToken';
          opts.extra['retried'] = true;
          final retry = await _dio.fetch(opts);
          handler.resolve(retry);
          return;
        }
      } catch (_) {}
      handler.next(err);
      return;
    }

    _isRefreshing = true;
    _refreshCompleter = Completer<String?>();

    try {
      final refreshToken = await _storage.read(key: 'refresh_token');
      if (refreshToken == null) {
        _refreshCompleter!.complete(null);
        handler.next(err);
        return;
      }
      final res = await _dioForRefresh.post('/auth/refresh', data: {'refreshToken': refreshToken});
      final newToken = res.data['token'] ?? res.data['accessToken'];
      final newRefresh = res.data['refreshToken'];
      if (newToken != null) {
        await _storage.write(key: 'access_token', value: newToken.toString());
        if (newRefresh != null) await _storage.write(key: 'refresh_token', value: newRefresh.toString());
        _refreshCompleter!.complete(newToken.toString());
        opts.headers['Authorization'] = 'Bearer $newToken';
        opts.extra['retried'] = true;
        final retry = await _dio.fetch(opts);
        handler.resolve(retry);
        return;
      }
      _refreshCompleter!.complete(null);
    } catch (_) {
      if (!(_refreshCompleter?.isCompleted ?? true)) _refreshCompleter!.complete(null);
      // clear tokens — caller should redirect to /login
      await _storage.delete(key: 'access_token');
      await _storage.delete(key: 'refresh_token');
    } finally {
      _isRefreshing = false;
    }
    handler.next(err);
  }
}
