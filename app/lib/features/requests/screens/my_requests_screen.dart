import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
class MyRequestsScreen extends StatelessWidget {
  const MyRequestsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return ListView(padding: const EdgeInsets.all(16), children: [
      Card(child: ListTile(leading: const CircleAvatar(child: Icon(Icons.beach_access)), title: const Text('Vacaciones'), subtitle: const Text('Solicita y revisa vacaciones'), trailing: const Icon(Icons.chevron_right), onTap: () => context.go('/vacations'))),
      Card(child: ListTile(leading: const CircleAvatar(child: Icon(Icons.security)), title: const Text('Licencias & Permisos'), subtitle: const Text('Gestiona permisos con certificado'), trailing: const Icon(Icons.chevron_right), onTap: () => context.go('/permissions'))),
    ]);
  }
}
