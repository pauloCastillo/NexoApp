import 'package:dio/dio.dart';
import 'package:nexo_app/domain/attendance/entities/attendance_record.dart';
import 'package:nexo_app/data/models/dashboard_summary_model.dart';

class DashboardRemoteSource {
  final Dio _dio;
  DashboardRemoteSource(this._dio);

  Future<DashboardSummaryModel> getSummary() async {
    final response = await _dio.get('/dashboard/summary');
    return DashboardSummaryModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<List<AttendanceRecord>> getAttendanceToday() async {
    final response = await _dio.get('/dashboard/attendance/today');
    final list = response.data['attendances'] as List;
    return list.map((e) => AttendanceRecord.fromJson(e as Map<String, dynamic>)).toList();
  }
}