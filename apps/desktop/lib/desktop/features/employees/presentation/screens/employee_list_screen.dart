import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_desktop/desktop/features/employees/presentation/providers/employee_provider.dart';

class EmployeeListScreen extends ConsumerWidget {
  const EmployeeListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final employeesAsync = ref.watch(employeeListProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Empleados')),
      body: employeesAsync.when(
        data: (employees) => ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: employees.length,
          itemBuilder: (_, i) => Card(
            child: ListTile(
              leading: CircleAvatar(child: Text(employees[i].username[0].toUpperCase())),
              title: Text(employees[i].username),
              subtitle: Text('${employees[i].email} · ${employees[i].jobTitle ?? "Sin cargo"}'),
              trailing: const Icon(Icons.chevron_right),
            ),
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {},
      ),
    );
  }
}