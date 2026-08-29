import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nexo_app/presentation/mobile/widgets/page_shell.dart';
import 'package:nexo_app/core/auth/token_service.dart';
import 'package:nexo_app/core/auth/auth_state.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return PageShell(
      title: 'Configuración',
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('PREFERENCIAS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
          const SizedBox(height: 8),
          Card(
            child: Column(
              children: [
                SwitchListTile(
                  title: const Text('Notificaciones'),
                  subtitle: const Text('Activadas'),
                  value: true,
                  onChanged: (_) {},
                ),
                const Divider(height: 1),
                ListTile(
                  title: const Text('Idioma'),
                  subtitle: const Text('Español'),
                  trailing: const Icon(Icons.chevron_right),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              style: OutlinedButton.styleFrom(foregroundColor: Colors.red, side: const BorderSide(color: Colors.red)),
              icon: const Icon(Icons.logout),
              label: const Text('Cerrar Sesión'),
              onPressed: () async {
                await TokenService().clearTokens();
                ref.read(authStateProvider.notifier).state = null;
                if (context.mounted) context.go('/login');
              },
            ),
          ),
        ],
      ),
    );
  }
}
