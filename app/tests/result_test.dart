import 'package:flutter_test/flutter_test.dart';
import 'package:dio/dio.dart';
import 'package:nexo_app/core/network/result.dart';
import 'package:nexo_app/core/network/api_exception.dart';

void main() {
  group('Result', () {
    test('Ok holds value', () {
      const r = Ok<int>(42);
      expect((r as Ok<int>).value, 42);
    });
    test('Err holds failure', () {
      const f = Failure(message: 'x', code: 'INTERNAL');
      const r = Err<int>(f);
      expect((r as Err<int>).failure.code, 'INTERNAL');
    });
    test('Result is sealed', () {
      Result<String> r = const Ok('hi');
      expect(r is Ok<String>, true);
      r = const Err(Failure(message: 'e', code: 'BAD_REQUEST'));
      expect(r is Err<String>, true);
    });
  });

  group('dioToFailure', () {
    test('maps 401 to UNAUTHORIZED', () {
      final e = DioException(
        requestOptions: RequestOptions(path: '/'),
        response: Response(requestOptions: RequestOptions(path: '/'), statusCode: 401, data: {'message': 'expired', 'code': 'UNAUTHORIZED'}),
        type: DioExceptionType.badResponse,
      );
      final f = dioToFailure(e);
      expect(f.code, 'UNAUTHORIZED');
      expect(f.statusCode, 401);
    });
    test('maps 404 to NOT_FOUND', () {
      final e = DioException(requestOptions: RequestOptions(path: '/'), response: Response(requestOptions: RequestOptions(path: '/'), statusCode: 404, data: {'message': 'not found'}), type: DioExceptionType.badResponse);
      expect(dioToFailure(e).code, 'NOT_FOUND');
    });
    test('maps 409 to DUPLICATE', () {
      final e = DioException(requestOptions: RequestOptions(path: '/'), response: Response(requestOptions: RequestOptions(path: '/'), statusCode: 409, data: {'message': 'dup'}), type: DioExceptionType.badResponse);
      expect(dioToFailure(e).code, 'DUPLICATE');
    });
    test('maps timeout to friendly', () {
      final e = DioException(requestOptions: RequestOptions(path: '/'), type: DioExceptionType.connectionTimeout);
      expect(dioToFailure(e).message, contains('Tiempo'));
    });
    test('maps connectionError', () {
      final e = DioException(requestOptions: RequestOptions(path: '/'), type: DioExceptionType.connectionError);
      expect(dioToFailure(e).message, contains('Sin conexión'));
    });
    test('extracts requestId from body', () {
      final e = DioException(requestOptions: RequestOptions(path: '/'), response: Response(requestOptions: RequestOptions(path: '/'), statusCode: 500, data: {'message': 'err', 'requestId': 'req-123'}), type: DioExceptionType.badResponse);
      expect(dioToFailure(e).requestId, 'req-123');
    });
    test('extracts errors array', () {
      final e = DioException(requestOptions: RequestOptions(path: '/'), response: Response(requestOptions: RequestOptions(path: '/'), statusCode: 400, data: {'message': 'bad', 'errors': [{'field':'email','message':'bad'}]}), type: DioExceptionType.badResponse);
      expect(dioToFailure(e).errors?.first['field'], 'email');
    });
  });
}
