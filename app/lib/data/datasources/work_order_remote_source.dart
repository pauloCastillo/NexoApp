import 'package:dio/dio.dart';
import 'package:nexo_app/domain/work_order/entities/work_order_model.dart';

class WorkOrderRemoteSource {
  final Dio _dio;
  WorkOrderRemoteSource(this._dio);

  Future<List<WorkOrderModel>> getAll() async {
    final response = await _dio.get('/work-orders');
    return (response.data as List).map((e) => WorkOrderModel.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<WorkOrderModel> create(Map<String, dynamic> data) async {
    final response = await _dio.post('/work-orders', data: data);
    return WorkOrderModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<WorkOrderModel> update(String id, Map<String, dynamic> data) async {
    final response = await _dio.put('/work-orders/$id', data: data);
    return WorkOrderModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> delete(String id) async => _dio.delete('/work-orders/$id');
}