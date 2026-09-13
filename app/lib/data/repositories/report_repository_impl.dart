import 'dart:typed_data';
import 'package:nexo_app/data/datasources/report_remote_source.dart';
import 'package:nexo_app/data/repositories/report_repository.dart';
import 'package:share_plus/share_plus.dart';

class ReportRepositoryImpl implements ReportRepository {
  final ReportRemoteSource _source;
  ReportRepositoryImpl(this._source);

  @override
  Future<Map<String, dynamic>> getAttendanceReport({
    required DateTime start,
    required DateTime end,
    String? employeeId,
  }) => _source.getAttendanceReport(
    start: start,
    end: end,
    employeeId: employeeId,
  );

  Future<void> shareExcel(
    Uint8List bytes, {
    String fileName = 'reporte.xlsx',
  }) async {
    final xfile = XFile.fromData(
      bytes,
      name: fileName,
      mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    await SharePlus.instance.share(
      ShareParams(
        text: 'Reporte Nexo',
        files: [xfile],
      ),
    );
  }
}
