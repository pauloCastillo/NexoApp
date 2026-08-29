import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/core/network/dio_provider.dart';
import 'package:nexo_app/domain/work_order/entities/work_order_model.dart';
import 'package:nexo_app/data/repositories/work_order_repository_impl.dart';
import 'package:nexo_app/domain/work_order/repositories/work_order_repository.dart';
import 'package:nexo_app/data/datasources/work_order_remote_source.dart';

final workOrderRepositoryProvider = Provider<WorkOrderRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return WorkOrderRepositoryImpl(WorkOrderRemoteSource(dio));
});

final workOrderListProvider = FutureProvider<List<WorkOrderModel>>((ref) {
  final repo = ref.watch(workOrderRepositoryProvider);
  return repo.getAll();
});