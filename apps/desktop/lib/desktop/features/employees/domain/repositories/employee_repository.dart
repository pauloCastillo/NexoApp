import 'package:nexo_desktop/core/models/employee.dart';

abstract class EmployeeRepository {
  Future<List<EmployeeModel>> getAll();
  Future<EmployeeModel> getById(String id);
  Future<EmployeeModel> create(Map<String, dynamic> data);
  Future<EmployeeModel> update(String id, Map<String, dynamic> data);
  Future<void> delete(String id);
}