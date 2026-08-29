import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/core/auth/auth_state.dart';
import 'package:nexo_app/core/auth/role_guards.dart';
class AdminRequestDetailScreen extends ConsumerWidget {
  final String id;
  const AdminRequestDetailScreen({super.key, required this.id});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final role = ref.watch(authStateProvider)?.role;
    final canApprove = canApprovePermission(role) || canApproveVacation(role);
    return Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('Solicitud $id', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      const SizedBox(height: 8),
      const Text('Empleado: Juan Pérez — Tipo: licencia — Motivo: médico — Adjunto: certificado.pdf'),
      const SizedBox(height: 8),
      TextButton.icon(onPressed: () {}, icon: const Icon(Icons.attachment), label: const Text('Ver certificado')),
      const SizedBox(height: 24),
      if (canApprove) Row(children: [
        Expanded(child: FilledButton(onPressed: () { ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Aprobado'))); }, child: const Text('Aprobar'))),
        const SizedBox(width: 12),
        Expanded(child: OutlinedButton(onPressed: () { ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Rechazado'))); }, child: const Text('Rechazar'))),
      ]) else const Text('Sin permiso para aprobar', style: TextStyle(color: Colors.grey)),
    ]));
  }
}
