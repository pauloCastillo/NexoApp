import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/auth/auth_state.dart';

class DesktopShell extends ConsumerWidget {
  final Widget child;
  const DesktopShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final current = GoRouterState.of(context).uri.toString();
    return Scaffold(
      appBar: AppBar(title: Text(_titleFor(current))),
      drawer: _Drawer(current: current),
      body: child,
    );
  }

  String _titleFor(String loc) {
    if (loc.startsWith('/employees')) return 'Equipo';
    if (loc.startsWith('/work-orders')) return 'Órdenes';
    if (loc.startsWith('/clients')) return 'Clientes';
    if (loc.startsWith('/reports')) return 'Reportes';
    if (loc.startsWith('/company-settings')) return 'Empresa';
    return 'Dashboard';
  }
}

class _Drawer extends ConsumerWidget {
  final String current;
  const _Drawer({required this.current});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authStateProvider);
    final cs = Theme.of(context).colorScheme;
    return Drawer(
      child: ListView(padding: EdgeInsets.zero, children: [
        DrawerHeader(
          decoration: BoxDecoration(color: cs.primary),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.end, children: [
            CircleAvatar(
              backgroundColor: Colors.white.withValues(alpha: 0.2),
              foregroundColor: Colors.white,
              child: Text((auth?.name ?? 'N').substring(0, 1).toUpperCase()),
            ),
            const SizedBox(height: 12),
            Text(auth?.name ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
            Text(auth?.email ?? '', style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 12)),
          ]),
        ),
        _item(context, Icons.dashboard_rounded, 'Dashboard', '/', current),
        _item(context, Icons.people_rounded, 'Equipo', '/employees', current),
        _item(context, Icons.assignment_rounded, 'Órdenes', '/work-orders', current),
        _item(context, Icons.business_rounded, 'Clientes', '/clients', current),
        _item(context, Icons.description_rounded, 'Reportes', '/reports', current),
        _item(context, Icons.apartment_rounded, 'Empresa', '/company-settings', current),
        const Divider(),
        ListTile(
          leading: const Icon(Icons.logout, color: Colors.red),
          title: const Text('Cerrar Sesión', style: TextStyle(color: Colors.red)),
          onTap: () {
            Navigator.pop(context);
            ref.read(authStateProvider.notifier).state = null;
            context.go('/login');
          },
        ),
      ]),
    );
  }

  Widget _item(BuildContext ctx, IconData ic, String label, String route, String cur) {
    final active = cur == route || cur.startsWith('$route/');
    final cs = Theme.of(ctx).colorScheme;
    return ListTile(
      leading: Icon(ic, color: active ? cs.primary : null),
      title: Text(label, style: TextStyle(color: active ? cs.primary : null, fontWeight: active ? FontWeight.w600 : null)),
      selected: active,
      onTap: () {
        Navigator.pop(ctx);
        if (cur != route) ctx.go(route);
      },
    );
  }
}
