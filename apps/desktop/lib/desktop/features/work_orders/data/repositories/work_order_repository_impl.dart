import 'package:nexo_desktop/desktop/features/work_orders/data/datasources/work_order_remote_source.dart';
import 'package:nexo_desktop/desktop/features/work_orders/domain/repositories/work_order_repository.dart';
import 'package:nexo_desktop/core/models/work_order.dart';

class WorkOrderRepositoryImpl implements WorkOrderRepository {
  final WorkOrderRemoteSource _source;
  WorkOrderRepositoryImpl(this._source);

  @override
  Future<List<WorkOrderModel>> getAll() => _source.getAll();
  @override
  Future<WorkOrderModel> create(Map<String, dynamic> data) => _source.create(data);
  @override
  Future<WorkOrderModel> update(String id, Map<String, dynamic> data) => _source.update(id, data);
  @override
  Future<void> delete(String id) => _source.delete(id);
}