import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class PageShell extends StatefulWidget {
  final String title;
  final Widget child;
  final bool showBottomBar;
  const PageShell({super.key, required this.title, required this.child, this.showBottomBar = true});

  @override
  State<PageShell> createState() => _PageShellState();
}

class _PageShellState extends State<PageShell> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        leading: Builder(builder: (ctx) => IconButton(icon: const Icon(Icons.menu), onPressed: () => Scaffold.of(ctx).openDrawer())),
        backgroundColor: const Color(0xFF4F6DFF),
        foregroundColor: Colors.white,
      ),
      drawer: _DrawerMenu(),
      body: widget.child,
      bottomNavigationBar: widget.showBottomBar ? _BottomTabBar() : null,
    );
  }
}

class _BottomTabBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final path = GoRouterState.of(context).matchedLocation;
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 4, offset: const Offset(0, -2))],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _tab(context, Icons.home, 'Inicio', '/home', path),
              _tab(context, Icons.assignment, 'Orden', '/order-day', path),
              _tab(context, Icons.dashboard, 'Dashboard', '/dashboard', path),
            ],
          ),
        ),
      ),
    );
  }

  Widget _tab(BuildContext context, IconData icon, String label, String route, String current) {
    final active = current == route;
    return InkWell(
      onTap: () => context.go(route),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: active ? const Color(0xFF4F6DFF) : Colors.grey, size: 24),
          Text(label, style: TextStyle(fontSize: 11, color: active ? const Color(0xFF4F6DFF) : Colors.grey)),
        ],
      ),
    );
  }
}

class _DrawerMenu extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(color: Color(0xFF4F6DFF)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: const [
                Text('Nexo', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                Text('Tu oficina de confianza', style: TextStyle(color: Colors.white70, fontSize: 12)),
              ],
            ),
          ),
          _sectionTitle('PRINCIPAL'),
          _item(context, Icons.home, 'Inicio', '/home'),
          _item(context, Icons.assignment, 'Orden del Día', '/order-day'),
          _item(context, Icons.history, 'Historial de Marcajes', '/history'),
          _item(context, Icons.work, 'Órdenes de Trabajo', '/work-orders'),
          _sectionTitle('GESTIÓN'),
          _item(context, Icons.beach_access, 'Vacaciones', '/vacations'),
          _item(context, Icons.security, 'Permisos', '/permissions'),
          _item(context, Icons.people, 'Clientes', '/clients'),
          _sectionTitle('ADMINISTRACIÓN'),
          _item(context, Icons.dashboard, 'Dashboard', '/dashboard'),
          _item(context, Icons.description, 'Reportes', '/reports'),
          _sectionTitle('CUENTA'),
          _item(context, Icons.info, 'Centro de Información', '/info-center'),
          _item(context, Icons.person, 'Perfil', '/profile'),
          _item(context, Icons.settings, 'Configuración', '/settings'),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Cerrar Sesión', style: TextStyle(color: Colors.red)),
            onTap: () {
              Navigator.of(context).pop();
              context.go('/login');
            },
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      child: Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1)),
    );
  }

  Widget _item(BuildContext context, IconData icon, String label, String route) {
    return ListTile(
      leading: Icon(icon),
      title: Text(label, style: const TextStyle(fontSize: 14)),
      onTap: () {
        Navigator.of(context).pop();
        context.go(route);
      },
    );
  }
}
