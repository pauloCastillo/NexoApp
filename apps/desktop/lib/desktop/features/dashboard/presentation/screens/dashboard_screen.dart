import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_desktop/desktop/features/dashboard/presentation/providers/dashboard_provider.dart';
import 'package:nexo_desktop/desktop/features/dashboard/presentation/widgets/kpi_card.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final summaryAsync = ref.watch(dashboardSummaryProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard')),
      drawer: _Drawer(context),
      body: summaryAsync.when(
        data: (s) => Padding(
          padding: const EdgeInsets.all(24),
          child: Wrap(
            spacing: 16,
            runSpacing: 16,
            children: [
              KpiCard(title: 'Empleados activos', value: s.activeEmployees.toString(), icon: Icons.people),
              KpiCard(title: 'Asistencias hoy', value: s.todayAttendances.toString(), icon: Icons.access_time),
              KpiCard(title: 'Permisos pendientes', value: s.pendingPermissions.toString(), icon: Icons.pending_actions),
              KpiCard(title: 'Órdenes activas', value: s.activeWorkOrders.toString(), icon: Icons.assignment),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _Drawer extends StatelessWidget {
  final BuildContext context;
  const _Drawer(this.context);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          DrawerHeader(child: Text('Nexo', style: Theme.of(context).textTheme.headlineMedium)),
          _item(Icons.dashboard, 'Dashboard', '/'),
          _item(Icons.people, 'Empleados', '/employees'),
          _item(Icons.assignment, 'Órdenes', '/work-orders'),
          _item(Icons.business, 'Clientes', '/clients'),
          _item(Icons.description, 'Reportes', '/reports'),
        ],
      ),
    );
  }

  Widget _item(IconData icon, String label, String route) => ListTile(
    leading: Icon(icon),
    title: Text(label),
    onTap: () => Navigator.of(context).pushReplacementNamed(route),
  );
}