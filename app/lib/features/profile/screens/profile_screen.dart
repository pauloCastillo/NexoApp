import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/presentation/mobile/widgets/page_shell.dart';
import 'package:nexo_app/core/auth/auth_state.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authStateProvider);

    return PageShell(
      title: 'Perfil',
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            CircleAvatar(
              radius: 40,
              backgroundColor: const Color(0xFF4F6DFF),
              child: Text(
                (auth?.name ?? 'U')[0].toUpperCase(),
                style: const TextStyle(fontSize: 32, color: Colors.white),
              ),
            ),
            const SizedBox(height: 16),
            Text(auth?.name ?? 'Usuario', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(auth?.email ?? '', style: TextStyle(color: Colors.grey[600])),
            const SizedBox(height: 24),
            Card(
              child: Column(
                children: [
                  _infoRow('Rol', auth?.role ?? ''),
                  const Divider(height: 1),
                  _infoRow('ID', auth?.userId ?? ''),
                  const Divider(height: 1),
                  _infoRow('Compañía', auth?.companyId ?? ''),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey[600])),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
