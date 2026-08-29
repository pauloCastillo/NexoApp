import 'package:dio/dio.dart';

class ReportRemoteSource {
  final Dio _dio;
  ReportRemoteSource(this._dio);

  Future<Map<String, dynamic>> getAttendanceReport({
    required DateTime start,
    required DateTime end,
    String? employeeId,
  }) async {
    final response = await _dio.get('/dashboard/summary', queryParameters: {
      'start': start.toIso8601String(),
      'end': end.toIso8601String(),
      'employeeId': ?employeeId,
    });
    return response.data as Map<String, dynamic>;
  }
}