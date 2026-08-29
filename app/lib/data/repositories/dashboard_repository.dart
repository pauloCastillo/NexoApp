import 'package:nexo_app/domain/attendance/entities/attendance_record.dart';
import 'package:nexo_app/data/models/dashboard_summary_model.dart';

abstract class DashboardRepository {
  Future<DashboardSummaryModel> getSummary();
  Future<List<AttendanceRecord>> getAttendanceToday();
}