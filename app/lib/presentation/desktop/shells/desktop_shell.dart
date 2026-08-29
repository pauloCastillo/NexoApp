import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/auth/auth_state.dart';

class DesktopShell extends ConsumerWidget {
  final Widget child;
  const DesktopShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authStateProvider);
    final cs = Theme.of(context).colorScheme;
    final current = GoRouterState.of(context).uri.toString();
    return Scaffold(
      body: Row(
        children: [
          NavigationDrawer(
            selectedIndex: _indexFor(current),
            onDestinationSelected: (i) => context.go(_routes[i]),
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(children: [
                  CircleAvatar(backgroundColor: cs.primary.withValues(alpha: 0.15), child: Text((auth?.name ?? 'N').substring(0, 1).toUpperCase())),
                  const SizedBox(width: 12),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(auth?.name ?? '', style: const TextStyle(fontWeight: FontWeight.w600)),
                    Text(auth?.email ?? '', style: TextStyle(fontSize: 12, color: cs.onSurfaceVariant)),
                  ])),
                ]),
              ),
              const Divider(),
              const NavigationDrawerDestination(icon: Icon(Icons.dashboard_rounded), label: Text('Dashboard')),
              const NavigationDrawerDestination(icon: Icon(Icons.people_rounded), label: Text('Equipo')),
              const NavigationDrawerDestination(icon: Icon(Icons.assignment_rounded), label: Text('Órdenes')),
              const NavigationDrawerDestination(icon: Icon(Icons.business_rounded), label: Text('Clientes')),
              const NavigationDrawerDestination(icon: Icon(Icons.description_rounded), label: Text('Reportes')),
              const NavigationDrawerDestination(icon: Icon(Icons.apartment_rounded), label: Text('Empresa')),
            ],
          ),
          const VerticalDivider(width: 1),
          Expanded(child: child),
        ],
      ),
    );
  }

  static const _routes = ['/', '/employees', '/work-orders', '/clients', '/reports', '/company-settings'];
  int _indexFor(String loc) {
    for (var i = 0; i < _routes.length; i++) {
      if (loc == _routes[i] || loc.startsWith('${_routes[i]}/')) return i;
    }
    return 0;
  }
}
