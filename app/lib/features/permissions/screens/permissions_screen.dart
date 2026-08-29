import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
// ponytail: PageShell replaced by EmployeeShell via routing; keep import for now
import 'package:nexo_app/presentation/mobile/widgets/page_shell.dart';

class PermissionsScreen extends ConsumerStatefulWidget {
  const PermissionsScreen({super.key});
  @override
  ConsumerState<PermissionsScreen> createState() => _PermissionsScreenState();
}

class _PermissionsScreenState extends ConsumerState<PermissionsScreen> {
  final List<Map<String, dynamic>> _permissions = [
    {'type': 'Permiso', 'start': '2025-07-01', 'end': '2025-07-02', 'reason': 'Cita médica', 'status': 'aprobado'},
    {'type': 'Licencia', 'start': '2025-07-10', 'end': '2025-07-12', 'reason': 'Asunto personal', 'status': 'pendiente'},
  ];
  bool _showForm = false;
  String _type = 'permiso';
  final _startController = TextEditingController();
  final _endController = TextEditingController();
  final _reasonController = TextEditingController();

  @override
  void dispose() {
    _startController.dispose();
    _endController.dispose();
    _reasonController.dispose();
    super.dispose();
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'aprobado': return const Color(0xFF4CAF50);
      case 'rechazado': return const Color(0xFFE53935);
      default: return Colors.orange;
    }
  }

  @override
  Widget build(BuildContext context) {
    return PageShell(
      title: 'Permisos',
      child: Column(
        children: [
          Expanded(
            child: _permissions.isEmpty
                ? const Center(child: Text('No hay solicitudes', style: TextStyle(color: Colors.grey)))
                : ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: _permissions.length,
                    itemBuilder: (_, i) {
                      final p = _permissions[i];
                      return Card(
                        child: ListTile(
                          title: Text(p['type'] as String, style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text('${p['start']} → ${p['end']}\n${p['reason']}'),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _statusColor(p['status'] as String).withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(p['status'] as String, style: TextStyle(color: _statusColor(p['status'] as String), fontSize: 12)),
                          ),
                          isThreeLine: true,
                        ),
                      );
                    },
                  ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                style: FilledButton.styleFrom(backgroundColor: const Color(0xFF4F6DFF)),
                icon: const Icon(Icons.add),
                label: const Text('Solicitar Permiso'),
                onPressed: () => setState(() => _showForm = !_showForm),
              ),
            ),
          ),
          if (_showForm)
            Container(
              padding: const EdgeInsets.all(16),
              color: Colors.grey[100],
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Nuevo Permiso', style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  ToggleButtons(
                    isSelected: [_type == 'permiso', _type == 'licencia', _type == 'otro'],
                    onPressed: (i) => setState(() => _type = ['permiso', 'licencia', 'otro'][i]),
                    children: const [Text('Permiso'), Text('Licencia'), Text('Otro')],
                  ),
                  const SizedBox(height: 12),
                  TextField(controller: _startController, decoration: const InputDecoration(labelText: 'Fecha inicio (YYYY-MM-DD)', border: OutlineInputBorder())),
                  const SizedBox(height: 8),
                  TextField(controller: _endController, decoration: const InputDecoration(labelText: 'Fecha fin (YYYY-MM-DD)', border: OutlineInputBorder())),
                  const SizedBox(height: 8),
                  TextField(controller: _reasonController, decoration: const InputDecoration(labelText: 'Motivo', border: OutlineInputBorder()), maxLines: 3),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: const Color(0xFF4CAF50)),
                      onPressed: () {
                        if (_startController.text.isNotEmpty && _endController.text.isNotEmpty) {
                          setState(() {
                            _permissions.insert(0, {
                              'type': _type,
                              'start': _startController.text,
                              'end': _endController.text,
                              'reason': _reasonController.text,
                              'status': 'pendiente',
                            });
                            _showForm = false;
                            _startController.clear();
                            _endController.clear();
                            _reasonController.clear();
                          });
                        }
                      },
                      child: const Text('ENVIAR'),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
