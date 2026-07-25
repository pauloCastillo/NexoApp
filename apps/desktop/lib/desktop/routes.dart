import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nexo_desktop/core/providers/providers.dart';
import 'package:nexo_desktop/desktop/features/auth/presentation/screens/login_screen.dart';
import 'package:nexo_desktop/desktop/features/dashboard/presentation/screens/dashboard_screen.dart';
import 'package:nexo_desktop/desktop/features/employees/presentation/screens/employee_list_screen.dart';
import 'package:nexo_desktop/desktop/features/work_orders/presentation/screens/work_order_list_screen.dart';
import 'package:nexo_desktop/desktop/features/clients/presentation/screens/client_list_screen.dart';
import 'package:nexo_desktop/desktop/features/reports/presentation/screens/report_screen.dart';

final goRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);
  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final logged = authState != null;
      final onLogin = state.matchedLocation == '/login';
      if (!logged && !onLogin) return '/login';
      if (logged && onLogin) return '/';
      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (_, _) => const LoginScreen()),
      GoRoute(path: '/', builder: (_, _) => const DashboardScreen()),
      GoRoute(path: '/employees', builder: (_, _) => const EmployeeListScreen()),
      GoRoute(path: '/work-orders', builder: (_, _) => const WorkOrderListScreen()),
      GoRoute(path: '/clients', builder: (_, _) => const ClientListScreen()),
      GoRoute(path: '/reports', builder: (_, _) => const ReportScreen()),
    ],
  );
});