import 'package:nexo_desktop/core/models/dashboard_summary.dart';

abstract class DashboardRepository {
  Future<DashboardSummaryModel> getSummary();
}