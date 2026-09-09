import 'package:dio/dio.dart';
import 'package:nexo_app/core/network/api_exception.dart';
import 'package:nexo_app/core/network/result.dart';
import 'package:nexo_app/domain/work_order/entities/work_order_model.dart';

class WorkOrderRemoteSource {
  final Dio _dio;
  WorkOrderRemoteSource(this._dio);

  Future<Result<List<WorkOrderModel>>> getAllResult() async {
    try {
      final response = await _dio.get('/work-orders');
      final data = response.data;
      List list;
      if (data is List) {
        list = data;
      } else if (data is Map && data['workOrders'] is List) {
        list = data['workOrders'] as List;
      } else {
        return Err(
          const Failure(
            message: 'No pudimos cargar órdenes.',
            code: 'INVALID_RESPONSE',
          ),
        );
      }

      return Ok(
        list
            .map((e) => WorkOrderModel.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<WorkOrderModel>> createResult(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/work-orders', data: data);
      final map = response.data is Map && response.data['workOrder'] != null
          ? response.data['workOrder'] as Map<String, dynamic>
          : response.data as Map<String, dynamic>;
      return Ok(WorkOrderModel.fromJson(map));
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<WorkOrderModel>> updateResult(
    String id,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.put('/work-orders/$id', data: data);
      final map = response.data is Map && response.data['workOrder'] != null
          ? response.data['workOrder'] as Map<String, dynamic>
          : response.data as Map<String, dynamic>;
      return Ok(WorkOrderModel.fromJson(map));
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  Future<Result<void>> deleteResult(String id) async {
    try {
      await _dio.delete('/work-orders/$id');
      return const Ok(null);
    } on DioException catch (e) {
      return Err(dioToFailure(e));
    }
  }

  // Backward compat
  Future<List<WorkOrderModel>> getAll() async {
    final r = await getAllResult();
    if (r is Ok<List<WorkOrderModel>>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<WorkOrderModel> create(Map<String, dynamic> data) async {
    final r = await createResult(data);
    if (r is Ok<WorkOrderModel>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<WorkOrderModel> update(String id, Map<String, dynamic> data) async {
    final r = await updateResult(id, data);
    if (r is Ok<WorkOrderModel>) return r.value;
    throw Exception((r as Err).failure.message);
  }

  Future<void> delete(String id) async {
    final r = await deleteResult(id);
    if (r is Ok) return;
    throw Exception((r as Err).failure.message);
  }
}
