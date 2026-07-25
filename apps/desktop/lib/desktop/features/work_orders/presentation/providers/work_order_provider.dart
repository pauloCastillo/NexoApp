import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_desktop/core/providers/providers.dart';
import 'package:nexo_desktop/core/models/work_order.dart';
import 'package:nexo_desktop/desktop/features/work_orders/data/repositories/work_order_repository_impl.dart';
import 'package:nexo_desktop/desktop/features/work_orders/domain/repositories/work_order_repository.dart';
import 'package:nexo_desktop/desktop/features/work_orders/data/datasources/work_order_remote_source.dart';

final workOrderRepositoryProvider = Provider<WorkOrderRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return WorkOrderRepositoryImpl(WorkOrderRemoteSource(dio));
});

final workOrderListProvider = FutureProvider<List<WorkOrderModel>>((ref) {
  final repo = ref.watch(workOrderRepositoryProvider);
  return repo.getAll();
});