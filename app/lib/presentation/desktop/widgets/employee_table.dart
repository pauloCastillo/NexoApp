import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:nexo_app/domain/employee/entities/employee_model.dart';
import 'package:nexo_app/domain/invitation/entities/invitation_model.dart';
import 'package:nexo_app/presentation/desktop/widgets/branch_assignment_dialog.dart';

class EmployeeTable extends StatelessWidget {
  final List<EmployeeModel> employees;
  final void Function(EmployeeModel) onEdit;
  final void Function(EmployeeModel) onDelete;
  final List<InvitationModel> pendingInvitations;
  final void Function(InvitationModel)? onRevokeInvitation;
  final void Function(InvitationModel)? onCopyCode;

  const EmployeeTable({
    super.key,
    required this.employees,
    required this.onEdit,
    required this.onDelete,
    this.pendingInvitations = const [],
    this.onRevokeInvitation,
    this.onCopyCode,
  });

  Color _statusColor(String role) {
    switch (role) {
      case 'supervisor':
      case 'manager':
        return const Color(0xFF8B5CF6);
      case 'admin':
        return const Color(0xFF4F6DFF);
      case 'hr_manager':
      case 'hr':
        return const Color(0xFFF59E0B);
      default:
        return const Color(0xFF06D6A0);
    }
  }

  Color _statusBg(String role) {
    return _statusColor(role).withValues(alpha: 0.12);
  }

  String _statusLabel(String role) {
    switch (role) {
      case 'supervisor':
      case 'manager':
        return 'Supervisor';
      case 'admin':
        return 'Admin';
      case 'hr_manager':
      case 'hr':
        return 'RRHH';
      case 'employee':
        return 'Colaborador';
      default:
        return role;
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final hasPending = pendingInvitations.isNotEmpty;
    // Single header DataTable — pending + empleados en filas continuas
    final rows = <DataRow>[
      ...pendingInvitations.map((inv) => DataRow(cells: [
            DataCell(_buildPendingAvatar(context, inv)),
            DataCell(Text(inv.invitedName ?? '—', style: const TextStyle(fontWeight: FontWeight.w500))),
            DataCell(Text(inv.invitedEmail ?? '—', style: TextStyle(color: cs.onSurfaceVariant))),
            DataCell(Text(inv.jobTitle ?? '—', style: TextStyle(color: cs.onSurfaceVariant))),
            DataCell(_buildRoleChip(inv.role, cs)),
            DataCell(_buildCodeCell(context, inv, cs)),
            DataCell(_buildPendingActions(context, inv, cs)),
          ])),
      ...employees.map((e) => DataRow(cells: [
            DataCell(_buildAvatar(context, e)),
            DataCell(Text(e.username, style: const TextStyle(fontWeight: FontWeight.w500))),
            DataCell(Text(e.email, style: TextStyle(color: cs.onSurfaceVariant))),
            DataCell(Text(e.jobTitle ?? '–', style: TextStyle(color: cs.onSurfaceVariant))),
            DataCell(_buildRoleChip(e.role, cs)),
            DataCell(Text('—', style: TextStyle(color: cs.onSurfaceVariant.withValues(alpha: 0.5)))),
            DataCell(_buildActions(e, cs)),
          ])),
    ];

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (hasPending)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              color: cs.surfaceContainerHighest.withValues(alpha: 0.5),
              child: Row(
                children: [
                  Icon(Icons.mail_outline_rounded, size: 18, color: cs.onSurfaceVariant),
                  const SizedBox(width: 8),
                  Text('Invitaciones pendientes', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: cs.onSurface)),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(color: cs.primaryContainer, borderRadius: BorderRadius.circular(10)),
                    child: Text('${pendingInvitations.length}', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: cs.onPrimaryContainer)),
                  ),
                  const Spacer(),
                  Text('El colaborador usa el código en su móvil para crear su cuenta', style: TextStyle(fontSize: 12, color: cs.onSurfaceVariant)),
                ],
              ),
            ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              headingRowHeight: 48,
              dataRowMinHeight: 52,
              dataRowMaxHeight: 52,
              columns: const [
                DataColumn(label: Text('')),
                DataColumn(label: Text('EMPLEADO')),
                DataColumn(label: Text('EMAIL')),
                DataColumn(label: Text('CARGO')),
                DataColumn(label: Text('ROL')),
                DataColumn(label: Text('CÓDIGO INVITACIÓN')),
                DataColumn(label: Text('')),
              ],
              rows: rows,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCodeCell(BuildContext context, InvitationModel inv, ColorScheme cs) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: cs.primaryContainer.withValues(alpha: 0.7),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: cs.primary.withValues(alpha: 0.2)),
          ),
          child: Text(inv.code, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, letterSpacing: 1.2, color: cs.onPrimaryContainer, fontFamily: 'monospace')),
        ),
        const SizedBox(width: 6),
        SizedBox(
          width: 32,
          height: 32,
          child: IconButton(
            icon: const Icon(Icons.copy_rounded, size: 16),
            tooltip: 'Copiar código',
            onPressed: () {
              Clipboard.setData(ClipboardData(text: inv.code));
              if (onCopyCode != null) {
                onCopyCode!(inv);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Código ${inv.code} copiado')));
              }
            },
          ),
        ),
      ],
    );
  }

  Widget _buildPendingAvatar(BuildContext context, InvitationModel inv) {
    final name = inv.invitedName ?? '?';
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        CircleAvatar(
          radius: 16,
          backgroundColor: Theme.of(context).colorScheme.tertiaryContainer,
          foregroundColor: Theme.of(context).colorScheme.onTertiaryContainer,
          child: Text(
            name.isNotEmpty ? name.substring(0, 2).toUpperCase() : '??',
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
          ),
        ),
        const SizedBox(width: 8),
        Container(width: 8, height: 8, decoration: BoxDecoration(color: Colors.orange, shape: BoxShape.circle)),
      ],
    );
  }

  Widget _buildAvatar(BuildContext context, EmployeeModel e) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        CircleAvatar(
          radius: 16,
          backgroundColor: Theme.of(context).colorScheme.primaryContainer,
          foregroundColor: Theme.of(context).colorScheme.onPrimaryContainer,
          child: Text(
            e.username.isNotEmpty ? e.username.substring(0, 2).toUpperCase() : '??',
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
          ),
        ),
        const SizedBox(width: 8),
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: _statusColor(e.role),
            shape: BoxShape.circle,
          ),
        ),
      ],
    );
  }

  Widget _buildRoleChip(String role, ColorScheme cs) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: _statusBg(role),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        _statusLabel(role),
        style: TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          color: _statusColor(role),
        ),
      ),
    );
  }

  Widget _buildActions(EmployeeModel e, ColorScheme cs) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: 36,
          height: 36,
          child: IconButton(
            icon: const Icon(Icons.edit_rounded, size: 18),
            onPressed: () => onEdit(e),
            tooltip: 'Editar',
          ),
        ),
        SizedBox(
          width: 36,
          height: 36,
          child: Builder(builder: (ctx) => IconButton(
            icon: const Icon(Icons.location_on_outlined, size: 18),
            tooltip: 'Zonas (${e.branches.length})',
            onPressed: () async {
              final ok = await showDialog<bool>(context: ctx, builder: (_) => BranchAssignmentDialog(employee: e));
              if (ok == true && ctx.mounted) ScaffoldMessenger.of(ctx).showSnackBar(const SnackBar(content: Text('Zonas actualizadas')));
            },
          )),
        ),
        SizedBox(
          width: 36,
          height: 36,
          child: IconButton(
            icon: const Icon(Icons.delete_rounded, size: 18),
            onPressed: () => onDelete(e),
            tooltip: 'Eliminar',
          ),
        ),
      ],
    );
  }

  Widget _buildPendingActions(BuildContext context, InvitationModel inv, ColorScheme cs) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: 36,
          height: 36,
          child: IconButton(
            icon: Icon(Icons.copy_rounded, size: 18, color: cs.primary),
            onPressed: () {
              Clipboard.setData(ClipboardData(text: inv.code));
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Código ${inv.code} copiado')));
            },
            tooltip: 'Copiar código',
          ),
        ),
        SizedBox(
          width: 36,
          height: 36,
          child: IconButton(
            icon: const Icon(Icons.delete_rounded, size: 18),
            onPressed: () => onRevokeInvitation?.call(inv),
            tooltip: 'Revocar invitación',
          ),
        ),
      ],
    );
  }
}
