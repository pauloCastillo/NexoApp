import 'package:nexo_app/domain/employee/entities/employee_model.dart';

abstract class EmployeeRepository {
  Future<List<EmployeeModel>> getAll();
  Future<EmployeeModel> getById(String id);
  Future<Map<String, dynamic>> create(Map<String, dynamic> data);
  Future<EmployeeModel> update(String id, Map<String, dynamic> data);
  Future<void> delete(String id);
}