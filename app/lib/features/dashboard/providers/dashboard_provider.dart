import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/core/network/dio_provider.dart';
import 'package:nexo_app/data/models/dashboard_summary_model.dart';
import 'package:nexo_app/data/repositories/dashboard_repository_impl.dart';
import 'package:nexo_app/data/repositories/dashboard_repository.dart';
import 'package:nexo_app/data/datasources/dashboard_remote_source.dart';

final dashboardRepositoryProvider = Provider<DashboardRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return DashboardRepositoryImpl(DashboardRemoteSource(dio));
});

final dashboardSummaryProvider = FutureProvider<DashboardSummaryModel>((ref) {
  final repo = ref.watch(dashboardRepositoryProvider);
  return repo.getSummary();
});