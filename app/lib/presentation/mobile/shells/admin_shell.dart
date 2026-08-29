import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/auth/auth_state.dart';

class AdminShell extends ConsumerWidget {
  final Widget child;
  const AdminShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final loc = GoRouterState.of(context).matchedLocation;
    return Scaffold(
      appBar: AppBar(title: Text(_titleFor(loc)), backgroundColor: const Color(0xFF4F6DFF), foregroundColor: Colors.white),
      drawer: _Drawer(),
      body: child,
      bottomNavigationBar: _BottomBar(current: loc),
    );
  }
  String _titleFor(String loc) {
    if (loc.startsWith('/admin/requests')) return 'Solicitudes';
    if (loc == '/admin') return 'Dashboard';
    if (loc == '/admin/team') return 'Equipo';
    if (loc == '/admin/attendance') return 'Asistencias';
    return 'Nexo Admin';
  }
}

class _BottomBar extends StatelessWidget {
  final String current;
  const _BottomBar({required this.current});
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 4, offset: const Offset(0,-2))]),
        child: Padding(padding: const EdgeInsets.symmetric(vertical: 4), child: Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
          _tab(context, Icons.dashboard, 'Dashboard', '/admin', current),
          _tab(context, Icons.groups, 'Equipo', '/admin/team', current),
          _tab(context, Icons.assignment, 'Órdenes', '/admin/work-orders', current),
          _tab(context, Icons.pending_actions, 'Solicitudes', '/admin/requests', current),
        ])),
      ),
    );
  }
  Widget _tab(BuildContext ctx, IconData icon, String label, String route, String cur) {
    final active = cur == route || cur.startsWith('$route/');
    return InkWell(onTap: () => ctx.go(route), child: Column(mainAxisSize: MainAxisSize.min, children: [
      Icon(icon, color: active ? const Color(0xFF4F6DFF) : Colors.grey, size: 24),
      Text(label, style: TextStyle(fontSize: 11, color: active ? const Color(0xFF4F6DFF) : Colors.grey)),
    ]));
  }
}

class _Drawer extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authStateProvider);
    return Drawer(child: ListView(padding: EdgeInsets.zero, children: [
      DrawerHeader(decoration: const BoxDecoration(color: Color(0xFF4F6DFF)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.end, children: [
        Text(auth?.name ?? 'Admin', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        Text(auth?.email ?? '', style: const TextStyle(color: Colors.white70, fontSize: 12)),
        Text(auth?.role ?? '', style: const TextStyle(color: Colors.white60, fontSize: 11)),
      ])),
      _sec('OPERACIÓN'),
      _item(context, Icons.dashboard, 'Dashboard', '/admin'),
      _item(context, Icons.location_on, 'Asistencias & Vivo', '/admin/attendance'),
      _item(context, Icons.assignment, 'Órdenes', '/admin/work-orders'),
      _item(context, Icons.business, 'Clientes', '/clients'),
      _sec('TALENTO'),
      _item(context, Icons.groups, 'Equipo', '/admin/team'),
      _item(context, Icons.pending_actions, 'Solicitudes', '/admin/requests'),
      _item(context, Icons.description, 'Reportes', '/reports'),
      _sec('ADMIN'),
      _item(context, Icons.apartment, 'Empresa & Geocerca', '/company-settings'),
      _item(context, Icons.info, 'Centro de Información', '/info-center'),
      _item(context, Icons.person, 'Perfil', '/profile'),
      const Divider(),
      ListTile(leading: const Icon(Icons.logout, color: Colors.red), title: const Text('Cerrar Sesión', style: TextStyle(color: Colors.red)), onTap: () { Navigator.pop(context); ref.read(authStateProvider.notifier).state=null; context.go('/login'); }),
    ]));
  }
  Widget _sec(String t) => Padding(padding: const EdgeInsets.fromLTRB(16,12,16,4), child: Text(t, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)));
  Widget _item(BuildContext ctx, IconData ic, String label, String route) => ListTile(leading: Icon(ic), title: Text(label, style: const TextStyle(fontSize: 14)), onTap: () { Navigator.pop(ctx); ctx.go(route); });
}
