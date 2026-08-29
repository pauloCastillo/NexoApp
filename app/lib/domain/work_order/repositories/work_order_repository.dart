import 'package:nexo_app/domain/work_order/entities/work_order_model.dart';

abstract class WorkOrderRepository {
  Future<List<WorkOrderModel>> getAll();
  Future<WorkOrderModel> create(Map<String, dynamic> data);
  Future<WorkOrderModel> update(String id, Map<String, dynamic> data);
  Future<void> delete(String id);
}