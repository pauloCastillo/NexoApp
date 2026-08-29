import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/presentation/mobile/widgets/page_shell.dart';

class VacationsScreen extends ConsumerStatefulWidget {
  const VacationsScreen({super.key});
  @override
  ConsumerState<VacationsScreen> createState() => _VacationsScreenState();
}

class _VacationsScreenState extends ConsumerState<VacationsScreen> {
  final List<Map<String, dynamic>> _vacations = [
    {'start': '2025-08-01', 'end': '2025-08-15', 'status': 'aprobado'},
    {'start': '2025-09-10', 'end': '2025-09-14', 'status': 'pendiente'},
  ];
  bool _showForm = false;
  final _startController = TextEditingController();
  final _endController = TextEditingController();

  @override
  void dispose() {
    _startController.dispose();
    _endController.dispose();
    super.dispose();
  }

  int _dayCount(String start, String end) {
    try {
      final s = DateTime.parse(start);
      final e = DateTime.parse(end);
      return e.difference(s).inDays + 1;
    } catch (_) {
      return 0;
    }
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
      title: 'Vacaciones',
      child: Column(
        children: [
          Expanded(
            child: _vacations.isEmpty
                ? const Center(child: Text('No hay solicitudes', style: TextStyle(color: Colors.grey)))
                : ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: _vacations.length,
                    itemBuilder: (_, i) {
                      final v = _vacations[i];
                      final days = _dayCount(v['start'] as String, v['end'] as String);
                      return Card(
                        child: ListTile(
                          title: Text('${v['start']} → ${v['end']}', style: const TextStyle(fontWeight: FontWeight.w500)),
                          subtitle: Text('$days días'),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _statusColor(v['status'] as String).withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(v['status'] as String, style: TextStyle(color: _statusColor(v['status'] as String), fontSize: 12)),
                          ),
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
                label: const Text('Solicitar Vacaciones'),
                onPressed: () => setState(() => _showForm = !_showForm),
              ),
            ),
          ),
          if (_showForm)
            Container(
              padding: const EdgeInsets.all(16),
              color: Colors.grey[100],
              child: Column(
                children: [
                  TextField(controller: _startController, decoration: const InputDecoration(labelText: 'Fecha inicio (YYYY-MM-DD)', border: OutlineInputBorder())),
                  const SizedBox(height: 8),
                  TextField(controller: _endController, decoration: const InputDecoration(labelText: 'Fecha fin (YYYY-MM-DD)', border: OutlineInputBorder())),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: const Color(0xFF4CAF50)),
                      onPressed: () {
                        if (_startController.text.isNotEmpty && _endController.text.isNotEmpty) {
                          setState(() {
                            _vacations.insert(0, {
                              'start': _startController.text,
                              'end': _endController.text,
                              'status': 'pendiente',
                            });
                            _showForm = false;
                            _startController.clear();
                            _endController.clear();
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
