import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:nexo_app/domain/attendance/entities/attendance_record.dart';

class AttendanceTable extends StatelessWidget {
  final List<AttendanceRecord> attendances;

  const AttendanceTable({super.key, required this.attendances});

  Color _statusColor(AttendanceRecord a) {
    if (a.descanso != null && a.retorno == null) return const Color(0xFFF59E0B);
    if (a.entrada != null && a.salida == null) return const Color(0xFF06D6A0);
    return const Color(0xFF94A3B8);
  }

  String _fmt(String? raw) {
    if (raw == null) return '–';
    try {
      return DateFormat('HH:mm').format(DateFormat('HH:mm:ss').parse(raw));
    } catch (_) {
      return raw.length >= 5 ? raw.substring(0, 5) : raw;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (attendances.isEmpty) {
      return Card(
        child: SizedBox(
          height: 200,
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.access_time_rounded, size: 48, color: Theme.of(context).colorScheme.onSurfaceVariant.withValues(alpha: 0.4)),
                const SizedBox(height: 12),
                Text('Sin asistencias hoy', style: TextStyle(fontSize: 15, color: Theme.of(context).colorScheme.onSurfaceVariant)),
              ],
            ),
          ),
        ),
      );
    }

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
            DataColumn(label: Text('ENTRADA')),
            DataColumn(label: Text('DESCANSO')),
            DataColumn(label: Text('RETORNO')),
            DataColumn(label: Text('SALIDA')),
          ],
          rows: attendances.map((a) {
            return DataRow(
              cells: [
                DataCell(_buildAvatar(context, a)),
                DataCell(Text(a.employeeName, style: const TextStyle(fontWeight: FontWeight.w500))),
                DataCell(Text(_fmt(a.entrada), style: const TextStyle(fontWeight: FontWeight.w600))),
                DataCell(Text(_fmt(a.descanso))),
                DataCell(Text(_fmt(a.retorno))),
                DataCell(Text(_fmt(a.salida))),
              ],
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildAvatar(BuildContext context, AttendanceRecord a) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        CircleAvatar(
          radius: 16,
          backgroundColor: Theme.of(context).colorScheme.primaryContainer,
          foregroundColor: Theme.of(context).colorScheme.onPrimaryContainer,
          child: Text(
            a.employeeName.isNotEmpty ? a.employeeName.substring(0, 2).toUpperCase() : '??',
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
          ),
        ),
        const SizedBox(width: 4),
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: _statusColor(a),
            shape: BoxShape.circle,
          ),
        ),
      ],
    );
  }
}
