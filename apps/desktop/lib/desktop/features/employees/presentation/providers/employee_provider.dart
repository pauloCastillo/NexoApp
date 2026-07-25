import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_desktop/core/providers/providers.dart';
import 'package:nexo_desktop/core/models/employee.dart';
import 'package:nexo_desktop/desktop/features/employees/data/repositories/employee_repository_impl.dart';
import 'package:nexo_desktop/desktop/features/employees/domain/repositories/employee_repository.dart';
import 'package:nexo_desktop/desktop/features/employees/data/datasources/employee_remote_source.dart';

final employeeRepositoryProvider = Provider<EmployeeRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return EmployeeRepositoryImpl(EmployeeRemoteSource(dio));
});

final employeeListProvider = FutureProvider<List<EmployeeModel>>((ref) {
  final repo = ref.watch(employeeRepositoryProvider);
  return repo.getAll();
});