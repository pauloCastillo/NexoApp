import 'package:nexo_app/data/datasources/employee_remote_source.dart';
import 'package:nexo_app/domain/employee/repositories/employee_repository.dart';
import 'package:nexo_app/domain/employee/entities/employee_model.dart';

class EmployeeRepositoryImpl implements EmployeeRepository {
  final EmployeeRemoteSource _source;
  EmployeeRepositoryImpl(this._source);

  @override
  Future<List<EmployeeModel>> getAll() => _source.getAll();
  @override
  Future<EmployeeModel> getById(String id) => _source.getById(id);
  @override
  Future<Map<String, dynamic>> create(Map<String, dynamic> data) => _source.create(data);
  @override
  Future<EmployeeModel> update(String id, Map<String, dynamic> data) => _source.update(id, data);
  @override
  Future<void> delete(String id) => _source.delete(id);
}