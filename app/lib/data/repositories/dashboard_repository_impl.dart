import 'package:nexo_app/domain/attendance/entities/attendance_record.dart';
import 'package:nexo_app/data/datasources/dashboard_remote_source.dart';
import 'package:nexo_app/data/repositories/dashboard_repository.dart';
import 'package:nexo_app/data/models/dashboard_summary_model.dart';

class DashboardRepositoryImpl implements DashboardRepository {
  final DashboardRemoteSource _source;
  DashboardRepositoryImpl(this._source);

  @override
  Future<DashboardSummaryModel> getSummary() => _source.getSummary();

  @override
  Future<List<AttendanceRecord>> getAttendanceToday() => _source.getAttendanceToday();
}