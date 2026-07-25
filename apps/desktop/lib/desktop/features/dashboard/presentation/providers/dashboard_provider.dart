import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_desktop/core/providers/providers.dart';
import 'package:nexo_desktop/core/models/dashboard_summary.dart';
import 'package:nexo_desktop/desktop/features/dashboard/data/repositories/dashboard_repository_impl.dart';
import 'package:nexo_desktop/desktop/features/dashboard/domain/repositories/dashboard_repository.dart';
import 'package:nexo_desktop/desktop/features/dashboard/data/datasources/dashboard_remote_source.dart';

final dashboardRepositoryProvider = Provider<DashboardRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return DashboardRepositoryImpl(DashboardRemoteSource(dio));
});

final dashboardSummaryProvider = FutureProvider<DashboardSummaryModel>((ref) {
  final repo = ref.watch(dashboardRepositoryProvider);
  return repo.getSummary();
});