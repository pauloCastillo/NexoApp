import 'package:dio/dio.dart';
import 'package:nexo_app/core/network/result.dart';

Failure dioToFailure(DioException err) {
  final res = err.response;
  final data = res?.data;
  String? code;
  String? message;
  String? requestId;
  List<Map<String, String>>? errors;
  if (data is Map) {
    code = data['code'] as String?;
    message = data['message'] as String?;
    requestId =
        data['requestId'] as String? ?? res?.headers.value('x-request-id');
    if (data['errors'] is List) {
      errors = (data['errors'] as List)
          .map((e) => Map<String, String>.from(e as Map))
          .toList();
    }
  }
  requestId ??= res?.headers.value('x-request-id');
  final status = res?.statusCode;
  if (message == null) {
    if (status == 401) {
      message = 'Tu sesión expiró. Inicia sesión de nuevo.';
    } else if (status == 404) {
      message = 'No encontramos lo que buscas.';
    } else if (status == 409) {
      message = 'Ya existe un registro con esos datos.';
    } else if (err.type == DioExceptionType.connectionTimeout ||
        err.type == DioExceptionType.receiveTimeout) {
      message = 'Tiempo de espera agotado. Verifica tu conexión.';
    } else if (err.type == DioExceptionType.connectionError) {
      message = 'Sin conexión. Verifica tu internet.';
    } else {
      message = 'Ocurrió un inconveniente. Intenta de nuevo.';
    }
  }

  code ??= status == 401
      ? 'UNAUTHORIZED'
      : status == 404
      ? 'NOT_FOUND'
      : status == 409
      ? 'DUPLICATE'
      : status != null && status >= 400 && status < 500
      ? 'BAD_REQUEST'
      : 'INTERNAL';
  return Failure(
    message: message,
    code: code,
    statusCode: status,
    requestId: requestId,
    errors: errors,
  );
}
