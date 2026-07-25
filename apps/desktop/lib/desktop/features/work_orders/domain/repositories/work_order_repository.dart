import 'package:nexo_desktop/core/models/work_order.dart';

abstract class WorkOrderRepository {
  Future<List<WorkOrderModel>> getAll();
  Future<WorkOrderModel> create(Map<String, dynamic> data);
  Future<WorkOrderModel> update(String id, Map<String, dynamic> data);
  Future<void> delete(String id);
}