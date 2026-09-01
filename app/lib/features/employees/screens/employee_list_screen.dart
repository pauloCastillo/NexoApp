import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/domain/employee/entities/employee_model.dart';
import 'package:nexo_app/domain/invitation/entities/invitation_model.dart';
import 'package:nexo_app/presentation/desktop/widgets/kpi_card.dart';
import 'package:nexo_app/features/employees/providers/employee_provider.dart';
import 'package:nexo_app/features/invitations/providers/invitation_provider.dart';
import 'package:nexo_app/presentation/desktop/widgets/add_employee_dialog.dart';
import 'package:nexo_app/presentation/desktop/widgets/employee_table.dart';
import 'package:nexo_app/presentation/desktop/widgets/invite_employee_dialog.dart';

class EmployeeListScreen extends ConsumerStatefulWidget {
  const EmployeeListScreen({super.key});

  @override
  ConsumerState<EmployeeListScreen> createState() => _EmployeeListScreenState();
}

class _EmployeeListScreenState extends ConsumerState<EmployeeListScreen> {
  Future<void> _addEmployee() async {
    await showDialog(context: context, builder: (_) => const InviteEmployeeDialog());
    ref.invalidate(invitationListProvider);
  }

  void _showCodeDialog(String code) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        title: const Text('Invitación creada'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Comparte este código con el colaborador para que cree su cuenta desde el móvil:'),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primaryContainer,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(code, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, letterSpacing: 2, color: Theme.of(context).colorScheme.onPrimaryContainer, fontFamily: 'monospace')),
                  const SizedBox(width: 12),
                  IconButton(
                    icon: const Icon(Icons.copy_rounded),
                    tooltip: 'Copiar',
                    onPressed: () {
                      Clipboard.setData(ClipboardData(text: code));
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Código $code copiado')));
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cerrar')),
          FilledButton(
            onPressed: () {
              Clipboard.setData(ClipboardData(text: code));
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Código $code copiado')));
            },
            child: const Text('Copiar código'),
          ),
        ],
      ),
    );
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

  Future<void> _revokeInvitation(InvitationModel inv) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        title: const Text('Revocar invitación'),
        content: Text('¿Revocar invitación ${inv.code} para ${inv.invitedName ?? inv.invitedEmail}?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancelar')),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: FilledButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.error),
            child: const Text('Revocar'),
          ),
        ],
      ),
    );
    if (confirmed != true) return;
    try {
      final repo = ref.read(invitationRepositoryProvider);
      await repo.revoke(inv.code);
      if (!mounted) return;
      ref.invalidate(invitationListProvider);
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Invitación revocada')));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error al revocar: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final employeesAsync = ref.watch(employeeListProvider);
    final invitationsAsync = ref.watch(invitationListProvider);
    final cs = Theme.of(context).colorScheme;

    return employeesAsync.when(
      data: (employees) {
        final invitations = invitationsAsync.valueOrNull ?? [];
        final isLoadingInv = invitationsAsync.isLoading;
        return SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildPageHeader(employees.length + invitations.length, cs),
              if (employees.isNotEmpty) ...[
                const SizedBox(height: 24),
                _buildKpiRow(employees, cs),
              ],
              const SizedBox(height: 24),
              if (isLoadingInv) const LinearProgressIndicator(),
              if (employees.isEmpty && invitations.isEmpty)
                _buildEmptyState(cs)
              else
                EmployeeTable(
                  employees: employees,
                  pendingInvitations: invitations,
                  onEdit: _editEmployee,
                  onDelete: _deleteEmployee,
                  onRevokeInvitation: _revokeInvitation,
                  onCopyCode: (inv) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Código ${inv.code} copiado')));
                  },
                ),
              if (invitationsAsync.hasError)
                Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: Text('Error cargando invitaciones: ${invitationsAsync.error}', style: TextStyle(color: cs.error, fontSize: 12)),
                ),
            ],
          ),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('Error: $e')),
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
    final supervisors = employees.where((e) => e.role == 'supervisor').length;
    final admins = employees.where((e) => e.role == 'admin').length;
    return Wrap(spacing: 16, runSpacing: 16, children: [
      KpiCard(title: 'Total empleados', value: employees.length.toString(), icon: Icons.people, color: cs.primary),
      KpiCard(title: 'Supervisores', value: supervisors.toString(), icon: Icons.supervisor_account, color: const Color(0xFF8B5CF6)),
      KpiCard(title: 'Administradores', value: admins.toString(), icon: Icons.admin_panel_settings, color: const Color(0xFF4F6DFF)),
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
