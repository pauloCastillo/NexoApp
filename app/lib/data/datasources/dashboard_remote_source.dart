import 'package:dio/dio.dart';
import 'package:nexo_app/core/network/api_exception.dart';
import 'package:nexo_app/core/network/result.dart';
import 'package:nexo_app/domain/attendance/entities/attendance_record.dart';
import 'package:nexo_app/data/models/dashboard_summary_model.dart';

class DashboardRemoteSource {
  final Dio _dio;
  DashboardRemoteSource(this._dio);

  Future<Result<DashboardSummaryModel>> getSummaryResult() async {
    try {
      final response = await _dio.get('/dashboard/summary');
      return Ok(DashboardSummaryModel.fromJson(response.data as Map<String, dynamic>));
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<List<AttendanceRecord>>> getAttendanceTodayResult() async {
    try {
      final response = await _dio.get('/dashboard/attendance/today');
      final list = response.data['attendances'] as List;
      return Ok(list.map((e) => AttendanceRecord.fromJson(e as Map<String, dynamic>)).toList());
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  // Backward compat
  Future<DashboardSummaryModel> getSummary() async {
    final r = await getSummaryResult();
    if (r is Ok<DashboardSummaryModel>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<List<AttendanceRecord>> getAttendanceToday() async {
    final r = await getAttendanceTodayResult();
    if (r is Ok<List<AttendanceRecord>>) return r.value;
    throw Exception((r as Err).failure.message);
  }
}
