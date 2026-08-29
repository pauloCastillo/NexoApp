import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/presentation/mobile/widgets/page_shell.dart';

class HistoryScreen extends ConsumerWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final records = [
      {'date': '2025-07-28', 'entrada': '08:00', 'descanso': '12:00', 'retorno': '13:00', 'salida': '17:00'},
      {'date': '2025-07-27', 'entrada': '08:15', 'descanso': '12:00', 'retorno': '13:00', 'salida': '16:45'},
      {'date': '2025-07-26', 'entrada': '08:30', 'descanso': '12:30', 'retorno': '13:30', 'salida': '17:30'},
    ];

    return PageShell(
      title: 'Historial de Marcajes',
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: records.length,
        itemBuilder: (_, i) {
          final r = records[i];
          return Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(r['date'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _timeItem('Entrada', r['entrada'] as String, const Color(0xFF4CAF50)),
                      _timeItem('Descanso', r['descanso'] as String, const Color(0xFF4F6DFF)),
                      _timeItem('Retorno', r['retorno'] as String, const Color(0xFF4CAF50)),
                      _timeItem('Salida', r['salida'] as String, const Color(0xFFE53935)),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _timeItem(String label, String time, Color color) {
    return Column(
      children: [
        Text(label, style: TextStyle(fontSize: 11, color: color)),
        const SizedBox(height: 2),
        Text(time, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: color)),
      ],
    );
  }
}
