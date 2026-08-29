import 'package:nexo_app/data/datasources/work_order_remote_source.dart';
import 'package:nexo_app/domain/work_order/repositories/work_order_repository.dart';
import 'package:nexo_app/domain/work_order/entities/work_order_model.dart';

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