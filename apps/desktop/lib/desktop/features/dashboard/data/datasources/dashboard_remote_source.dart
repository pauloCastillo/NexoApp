import 'package:dio/dio.dart';
import 'package:nexo_desktop/core/models/dashboard_summary.dart';

class DashboardRemoteSource {
  final Dio _dio;
  DashboardRemoteSource(this._dio);

  Future<DashboardSummaryModel> getSummary() async {
    final response = await _dio.get('/dashboard/summary');
    return DashboardSummaryModel.fromJson(response.data as Map<String, dynamic>);
  }
}