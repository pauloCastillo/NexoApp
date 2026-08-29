import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nexo_app/domain/employee/entities/employee_model.dart';
import 'package:nexo_app/core/auth/auth_state.dart';
import 'package:nexo_app/presentation/desktop/widgets/kpi_card.dart';
import 'package:nexo_app/features/employees/providers/employee_provider.dart';
import 'package:nexo_app/presentation/desktop/widgets/add_employee_dialog.dart';
import 'package:nexo_app/presentation/desktop/widgets/employee_table.dart';

class EmployeeListScreen extends ConsumerStatefulWidget {
  const EmployeeListScreen({super.key});

  @override
  ConsumerState<EmployeeListScreen> createState() => _EmployeeListScreenState();
}

class _EmployeeListScreenState extends ConsumerState<EmployeeListScreen> {
  Future<void> _addEmployee() async {
    final data = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (_) => const AddEmployeeDialog(),
    );
    if (data == null) return;

    try {
      final repo = ref.read(employeeRepositoryProvider);
      await repo.create(data);
      if (!mounted) return;
      ref.invalidate(employeeListProvider);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al crear: $e')),
      );
    }
  }

  Future<void> _editEmployee(EmployeeModel employee) async {
    final data = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (_) => AddEmployeeDialog(employee: employee),
    );
    if (data == null) return;

    try {
      final repo = ref.read(employeeRepositoryProvider);
      await repo.update(employee.id, data);
      if (!mounted) return;
      ref.invalidate(employeeListProvider);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al actualizar: $e')),
      );
    }
  }

  Future<void> _deleteEmployee(EmployeeModel employee) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        title: const Text('Eliminar empleado'),
        content: Text('¿Eliminar a ${employee.username}? Esta acción no se puede deshacer.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancelar')),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: FilledButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.error),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
    if (confirmed != true) return;

    try {
      final repo = ref.read(employeeRepositoryProvider);
      await repo.delete(employee.id);
      if (!mounted) return;
      ref.invalidate(employeeListProvider);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al eliminar: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authStateProvider);
    final employeesAsync = ref.watch(employeeListProvider);
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        leading: Builder(builder: (ctx) => IconButton(
          icon: const Icon(Icons.menu_rounded),
          onPressed: () => Scaffold.of(ctx).openDrawer(),
        )),
        title: const Text('Empleados', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 18)),
      ),
      drawer: _Drawer(authState: auth),
      body: employeesAsync.when(
        data: (employees) => SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildPageHeader(employees.length, cs),
              if (employees.isNotEmpty) ...[
                const SizedBox(height: 24),
                _buildKpiRow(employees, cs),
              ],
              const SizedBox(height: 24),
              if (employees.isEmpty)
                _buildEmptyState(cs)
              else
                EmployeeTable(
                  employees: employees,
                  onEdit: _editEmployee,
                  onDelete: _deleteEmployee,
                ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }

  Widget _buildPageHeader(int count, ColorScheme cs) {
    return Row(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Empleados', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w600, color: cs.onSurface)),
            const SizedBox(height: 4),
            Text('$count registros', style: TextStyle(fontSize: 14, color: cs.onSurfaceVariant)),
          ],
        ),
        const Spacer(),
        FilledButton.icon(
          icon: const Icon(Icons.person_add_rounded, size: 18),
          label: const Text('Nuevo empleado'),
          onPressed: _addEmployee,
        ),
      ],
    );
  }

  Widget _buildKpiRow(List<EmployeeModel> employees, ColorScheme cs) {
    final managers = employees.where((e) => e.role == 'manager').length;
    final editors = employees.where((e) => e.role == 'editor').length;
    return Wrap(spacing: 16, runSpacing: 16, children: [
      KpiCard(title: 'Total empleados', value: employees.length.toString(), icon: Icons.people, color: cs.primary),
      KpiCard(title: 'Gerentes', value: managers.toString(), icon: Icons.supervisor_account, color: const Color(0xFF8B5CF6)),
      KpiCard(title: 'Editores', value: editors.toString(), icon: Icons.edit_note, color: const Color(0xFF4F6DFF)),
    ]);
  }

  Widget _buildEmptyState(ColorScheme cs) {
    return Card(
      child: SizedBox(
        height: 300,
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.people_outline_rounded, size: 64,
                color: cs.onSurfaceVariant.withValues(alpha: 0.3)),
              const SizedBox(height: 16),
              Text('Aún no hay empleados',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: cs.onSurfaceVariant)),
              const SizedBox(height: 8),
              Text('Agrega tu primer empleado para comenzar',
                style: TextStyle(fontSize: 14, color: cs.onSurfaceVariant)),
              const SizedBox(height: 24),
              FilledButton.icon(
                icon: const Icon(Icons.person_add_rounded),
                label: const Text('Agregar empleado'),
                onPressed: _addEmployee,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Drawer extends ConsumerWidget {
  final AuthState? authState;

  const _Drawer({this.authState});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cs = Theme.of(context).colorScheme;
    final currentRoute = GoRouterState.of(context).uri.toString();

    return Drawer(
      child: Column(
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: cs.primary),
            margin: EdgeInsets.zero,
            child: SizedBox(
              width: double.infinity,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  CircleAvatar(
                    radius: 26,
                    backgroundColor: Colors.white.withValues(alpha: 0.2),
                    foregroundColor: Colors.white,
                    child: Text(
                      authState?.name != null
                          ? authState!.name!.substring(0, 2).toUpperCase()
                          : '??',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(authState?.name ?? '', style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
                  if (authState?.email != null)
                    Text(authState!.email!, style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 13)),
                ],
              ),
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 8),
              children: [
                _navItem(context, Icons.dashboard_rounded, 'Dashboard', '/', currentRoute),
                _navItem(context, Icons.people_rounded, 'Empleados', '/employees', currentRoute),
                _navItem(context, Icons.assignment_rounded, 'Órdenes', '/work-orders', currentRoute),
                _navItem(context, Icons.business_rounded, 'Clientes', '/clients', currentRoute),
                _navItem(context, Icons.description_rounded, 'Reportes', '/reports', currentRoute),
              ],
            ),
          ),
          const Divider(height: 1),
          ListTile(
            leading: Icon(Icons.logout_rounded, color: cs.onSurfaceVariant),
            title: Text('Cerrar sesión', style: TextStyle(color: cs.onSurfaceVariant)),
            onTap: () {
              ref.read(authStateProvider.notifier).state = null;
              context.go('/login');
            },
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _navItem(BuildContext context, IconData icon, String label, String route, String current) {
    final isActive = current == route;
    final cs = Theme.of(context).colorScheme;
    return ListTile(
      leading: Icon(icon, color: isActive ? cs.primary : cs.onSurfaceVariant),
      title: Text(label, style: TextStyle(
        fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
        color: isActive ? cs.primary : cs.onSurface,
      )),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      selected: isActive,
      selectedTileColor: cs.primaryContainer.withValues(alpha: 0.4),
      onTap: () {
        if (current != route) context.pushReplacement(route);
        Navigator.of(context).pop();
      },
    );
  }
}
