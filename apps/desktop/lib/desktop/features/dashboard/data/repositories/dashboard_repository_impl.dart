import 'package:nexo_desktop/desktop/features/dashboard/data/datasources/dashboard_remote_source.dart';
import 'package:nexo_desktop/desktop/features/dashboard/domain/repositories/dashboard_repository.dart';
import 'package:nexo_desktop/core/models/dashboard_summary.dart';

class DashboardRepositoryImpl implements DashboardRepository {
  final DashboardRemoteSource _source;
  DashboardRepositoryImpl(this._source);

  @override
  Future<DashboardSummaryModel> getSummary() => _source.getSummary();
}