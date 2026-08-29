import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/presentation/mobile/widgets/page_shell.dart';

class InfoCenterScreen extends ConsumerWidget {
  const InfoCenterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final news = [
      {'date': '2025-07-28', 'title': 'Teletrabajo', 'body': 'Recordamos la política de teletrabajo vigente. Los días lunes y viernes son opcionales para trabajo remoto previa autorización.'},
      {'date': '2025-07-15', 'title': 'Nuevo Módulo de Clientes', 'body': 'Se ha implementado el nuevo sistema de gestión de clientes. Revisa la sección de Clientes en tu menú.'},
      {'date': '2025-07-01', 'title': 'Feriado Nacional', 'body': 'Recordamos que el 6 de agosto es feriado nacional por aniversario patrio.'},
    ];

    return PageShell(
      title: 'Centro de Información',
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: news.length,
        itemBuilder: (_, i) {
          final n = news[i];
          return Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(n['date'] as String, style: TextStyle(fontSize: 12, color: Colors.grey[600])),
                  const SizedBox(height: 4),
                  Text(n['title'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 8),
                  Text(n['body'] as String, style: TextStyle(color: Colors.grey[700])),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
