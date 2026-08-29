import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class AdminRequestsScreen extends ConsumerStatefulWidget {
  const AdminRequestsScreen({super.key});
  @override
  ConsumerState<AdminRequestsScreen> createState() => _AdminRequestsScreenState();
}
class _AdminRequestsScreenState extends ConsumerState<AdminRequestsScreen> with SingleTickerProviderStateMixin {
  late TabController _tab;
  @override void initState() { super.initState(); _tab = TabController(length: 3, vsync: this); }
  @override void dispose() { _tab.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) {
    return Column(children: [
      TabBar(controller: _tab, tabs: const [Tab(text: 'Pendientes'), Tab(text: 'Aprobadas'), Tab(text: 'Rechazadas')]),
      Expanded(child: TabBarView(controller: _tab, children: [
        _list('pendiente'),
        _list('aprobado'),
        _list('rechazado'),
      ])),
    ]);
  }
  Widget _list(String status) {
    // placeholder — integrate with permission/vacation providers
    final items = [
      {'id': '1', 'name': 'Juan Pérez', 'type': 'licencia', 'status': status},
      {'id': '2', 'name': 'Ana Gómez', 'type': 'vacaciones', 'status': status},
    ];
    if (status != 'pendiente') return ListView(children: items.map((e) => Card(child: ListTile(title: Text(e['name']!), subtitle: Text(e['type']!)))).toList());
    return ListView(children: items.map((e) => Card(child: ListTile(title: Text(e['name']!), subtitle: Text(e['type']!), trailing: TextButton(onPressed: () => context.go('/admin/requests/${e['id']}'), child: const Text('Ver'))))).toList());
  }
}
