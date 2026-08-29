import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/core/network/dio_provider.dart';
import 'package:nexo_app/domain/employee/entities/employee_model.dart';
import 'package:nexo_app/data/repositories/employee_repository_impl.dart';
import 'package:nexo_app/domain/employee/repositories/employee_repository.dart';
import 'package:nexo_app/data/datasources/employee_remote_source.dart';

final employeeRepositoryProvider = Provider<EmployeeRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return EmployeeRepositoryImpl(EmployeeRemoteSource(dio));
});

final employeeListProvider = FutureProvider<List<EmployeeModel>>((ref) {
  final repo = ref.watch(employeeRepositoryProvider);
  return repo.getAll();
});