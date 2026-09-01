import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/domain/attendance/entities/attendance_record.dart';
import 'package:nexo_app/data/models/dashboard_summary_model.dart';
import 'package:nexo_app/core/auth/auth_state.dart';
import 'package:nexo_app/features/dashboard/providers/dashboard_provider.dart';
import 'package:nexo_app/presentation/desktop/widgets/kpi_card.dart';
import 'package:nexo_app/presentation/desktop/widgets/dashboard_header.dart';
import 'package:nexo_app/presentation/desktop/widgets/attendance_table.dart';
import 'package:nexo_app/core/network/dashboard_socket_service.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  List<AttendanceRecord> _attendances = [];
  bool _loading = true;
  final _socketService = DashboardSocketService();
  StreamSubscription<Map<String, dynamic>>? _socketSub;
  StreamSubscription<Map<String, dynamic>>? _inviteSub;

  @override
  void initState() {
    super.initState();
    _loadAttendance();
    _setupSocket();
  }

  @override
  void dispose() {
    _socketSub?.cancel();
    _inviteSub?.cancel();
    _socketService.disconnect();
    super.dispose();
  }

  Future<void> _loadAttendance() async {
    try {
      final repo = ref.read(dashboardRepositoryProvider);
      final list = await repo.getAttendanceToday();
      if (mounted) setState(() { _attendances = list; _loading = false; });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _setupSocket() {
    final auth = ref.read(authStateProvider);
    if (auth == null) return;
    _socketService.connect('http://localhost:8080', auth.userId ?? '');
    _socketSub = _socketService.attendanceUpdates.listen((_) => _loadAttendance());
    _inviteSub = _socketService.invitationRequests.listen((data) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Solicitud de nuevo código: ${data['code'] ?? ''} (${data['email'] ?? data['phone'] ?? ''})')));
    });
  }

  @override
  Widget build(BuildContext context) {
    final summaryAsync = ref.watch(dashboardSummaryProvider);
    final auth = ref.watch(authStateProvider);
    final checkedIn = _attendances.where((a) => a.entrada != null && a.salida == null).length;
    final cs = Theme.of(context).colorScheme;

    // responsive: Shell provides navigation, no Drawer/AppBar here
    return summaryAsync.when(
      data: (s) => LayoutBuilder(builder: (ctx, c) {
        final isNarrow = c.maxWidth < 600;
        final pad = isNarrow ? const EdgeInsets.all(16) : const EdgeInsets.symmetric(horizontal: 32, vertical: 24);
        return SingleChildScrollView(
          padding: pad,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            DashboardHeader(userName: auth?.name ?? '', companyName: ''),
            const SizedBox(height: 24),
            _sectionHeader('Resumen'),
            const SizedBox(height: 16),
            _buildKpiRow(s, checkedIn, cs),
            const SizedBox(height: 32),
            _sectionHeader('Asistencias de hoy', trailing: Text('${_attendances.length} registros', style: TextStyle(fontSize: 13, color: cs.onSurfaceVariant))),
            const SizedBox(height: 16),
            _loading ? const Center(child: CircularProgressIndicator()) : isNarrow ? _attendanceCards() : AttendanceTable(attendances: _attendances),
          ]),
        );
      }),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('Error: $e')),
    );
  }

  Widget _sectionHeader(String title, {Widget? trailing}) {
    final cs = Theme.of(context).colorScheme;
    return Row(
      children: [
        Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: cs.onSurface)),
        if (trailing != null) ...[const Spacer(), trailing],
      ],
    );
  }

  Widget _buildKpiRow(DashboardSummaryModel s, int checkedIn, ColorScheme cs) {
    // J2 Aqua/Graphite mapping — tokens, no hardcode pastels fuera de paleta
    return Wrap(spacing: 16, runSpacing: 16, children: [
      KpiCard(title: 'Empleados activos', value: s.activeEmployees.toString(), icon: Icons.people, color: cs.secondary), // navy 0F2A4A
      KpiCard(title: 'Asistencias hoy', value: s.todayAttendances.toString(), icon: Icons.access_time, color: cs.primary), // teal 00A99D
      KpiCard(title: 'Permisos pendientes', value: s.pendingPermissions.toString(), icon: Icons.pending_actions, color: const Color(0xFFFFC857)), // amber J2 accent
      KpiCard(title: 'Órdenes activas', value: s.activeWorkOrders.toString(), icon: Icons.assignment, color: const Color(0xFF4F6DFF)), // indigo tertiary
      KpiCard(title: 'En línea ahora', value: checkedIn.toString(), icon: Icons.person_pin, color: const Color(0xFF2CEAA3)), // light teal dark-mode primary
    ]);
  }

  Widget _attendanceCards() {
    if (_attendances.isEmpty) return const Card(child: Padding(padding: EdgeInsets.all(24), child: Text('Sin asistencias hoy')));
    // ponytail: id is non-null, employeeName fallback is intentional for responsive cards
    return Column(children: _attendances.map((a) => Card(child: ListTile(title: Text(a.employeeName.isNotEmpty ? a.employeeName : a.id), subtitle: Text('Entrada: ${a.entrada ?? '-'} • Salida: ${a.salida ?? '-'}')))).toList());
  }
}
