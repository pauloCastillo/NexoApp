abstract class ReportRepository {
  Future<Map<String, dynamic>> getAttendanceReport({
    required DateTime start,
    required DateTime end,
    String? employeeId,
  });
}