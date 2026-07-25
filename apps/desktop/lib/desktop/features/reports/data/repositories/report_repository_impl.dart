import 'package:nexo_desktop/desktop/features/reports/data/datasources/report_remote_source.dart';
import 'package:nexo_desktop/desktop/features/reports/domain/repositories/report_repository.dart';

class ReportRepositoryImpl implements ReportRepository {
  final ReportRemoteSource _source;
  ReportRepositoryImpl(this._source);

  @override
  Future<Map<String, dynamic>> getAttendanceReport({
    required DateTime start,
    required DateTime end,
    String? employeeId,
  }) => _source.getAttendanceReport(start: start, end: end, employeeId: employeeId);
}