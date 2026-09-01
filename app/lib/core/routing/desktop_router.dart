import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../auth/auth_state.dart';
import '../../presentation/desktop/shells/desktop_shell.dart';
import '../../presentation/mobile/navigation/splash_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/dashboard/screens/dashboard_screen.dart';
import '../../features/employees/screens/employee_list_screen.dart';
import '../../features/work_orders/screens/work_order_list_screen.dart';
import '../../features/clients/screens/client_list_screen.dart';
import '../../features/reports/screens/report_screen.dart';
import '../../features/companies/screens/company_settings_screen.dart';
import '../../features/requests/screens/admin_requests_screen.dart';
import '../../features/requests/screens/admin_request_detail_screen.dart';

final desktopRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    redirect: (ctx, state) {
      final auth = ref.read(authStateProvider);
      final loc = state.matchedLocation;
      if (loc == '/splash' || loc.startsWith('/invite')) return null;
      if (auth == null) return (loc == '/login' || loc == '/register' || loc.startsWith('/invite')) ? null : '/login';
      final role = auth.role;
      if (loc == '/login' || loc == '/register') return role == 'employee' ? '/login' : '/';
      // ponytail: desktop is manager view — employee blocked, platform_only allowed
      if (role == 'employee') return '/login';
      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (_, _) => const SplashScreen()),
      GoRoute(path: '/login', builder: (_, _) => const LoginScreen()),
      GoRoute(path: '/register', builder: (_, _) => const RegisterScreen()),
      GoRoute(path: '/invite/:code', builder: (_, s) => RegisterScreen(initialCode: s.pathParameters['code'])),
      GoRoute(path: '/admin', redirect: (_, _) => '/'),
      GoRoute(path: '/home', redirect: (_, _) => '/'),
      ShellRoute(builder: (_, _, child) => DesktopShell(child: child), routes: [
        GoRoute(path: '/', builder: (_, _) => const DashboardScreen()),
        GoRoute(path: '/employees', builder: (_, _) => const EmployeeListScreen()),
        GoRoute(path: '/work-orders', builder: (_, _) => const WorkOrderListScreen()),
        GoRoute(path: '/clients', builder: (_, _) => const ClientListScreen()),
        GoRoute(path: '/reports', builder: (_, _) => const ReportScreen()),
        GoRoute(path: '/company-settings', builder: (_, _) => const CompanySettingsScreen()),
        GoRoute(path: '/admin/requests', builder: (_, _) => const AdminRequestsScreen()),
        GoRoute(path: '/admin/requests/:id', builder: (_, s) => AdminRequestDetailScreen(id: s.pathParameters['id']!)),
      ]),
    ],
  );
});
