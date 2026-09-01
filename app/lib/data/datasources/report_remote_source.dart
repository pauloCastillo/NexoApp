import 'package:dio/dio.dart';
import 'package:nexo_app/core/network/api_exception.dart';
import 'package:nexo_app/core/network/result.dart';

class ReportRemoteSource {
  final Dio _dio;
  ReportRemoteSource(this._dio);

  Future<Result<Map<String, dynamic>>> getAttendanceReportResult({required DateTime start, required DateTime end, String? employeeId}) async {
    try {
      final qp = <String, dynamic>{'start': start.toIso8601String(), 'end': end.toIso8601String()};
      if (employeeId != null) qp['employeeId'] = employeeId;
      final response = await _dio.get('/dashboard/summary', queryParameters: qp);
      return Ok(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Map<String, dynamic>> getAttendanceReport({required DateTime start, required DateTime end, String? employeeId}) async {
    final r = await getAttendanceReportResult(start: start, end: end, employeeId: employeeId);
    if (r is Ok<Map<String, dynamic>>) return r.value;
    throw Exception((r as Err).failure.message);
  }
}
