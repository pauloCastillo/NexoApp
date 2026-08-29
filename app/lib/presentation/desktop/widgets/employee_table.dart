import 'package:flutter/material.dart';
import 'package:nexo_app/domain/employee/entities/employee_model.dart';

class EmployeeTable extends StatelessWidget {
  final List<EmployeeModel> employees;
  final void Function(EmployeeModel) onEdit;
  final void Function(EmployeeModel) onDelete;

  const EmployeeTable({
    super.key,
    required this.employees,
    required this.onEdit,
    required this.onDelete,
  });

  Color _statusColor(String role) {
    switch (role) {
      case 'manager':
        return const Color(0xFF8B5CF6);
      case 'editor':
        return const Color(0xFF4F6DFF);
      default:
        return const Color(0xFF06D6A0);
    }
  }

  Color _statusBg(String role) {
    return _statusColor(role).withValues(alpha: 0.12);
  }

  String _statusLabel(String role) {
    switch (role) {
      case 'manager':
        return 'Gerente';
      case 'editor':
        return 'Editor';
      case 'employee':
        return 'Empleado';
      default:
        return role;
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Card(
      clipBehavior: Clip.antiAlias,
      child: SingleChildScrollView(
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
            DataColumn(label: Text('')),
          ],
          rows: employees.map((e) {
            return DataRow(cells: [
              DataCell(_buildAvatar(context, e)),
              DataCell(Text(e.username, style: const TextStyle(fontWeight: FontWeight.w500))),
              DataCell(Text(e.email, style: TextStyle(color: cs.onSurfaceVariant))),
              DataCell(Text(e.jobTitle ?? '–', style: TextStyle(color: cs.onSurfaceVariant))),
              DataCell(_buildRoleChip(e, cs)),
              DataCell(_buildActions(e, cs)),
            ]);
          }).toList(),
        ),
      ),
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

  Widget _buildRoleChip(EmployeeModel e, ColorScheme cs) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: _statusBg(e.role),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        _statusLabel(e.role),
        style: TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          color: _statusColor(e.role),
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
          child: IconButton(
            icon: const Icon(Icons.delete_rounded, size: 18),
            onPressed: () => onDelete(e),
            tooltip: 'Eliminar',
          ),
        ),
      ],
    );
  }
}
