import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../auth/auth_state.dart';
import '../auth/role_guards.dart';
import '../../presentation/mobile/shells/employee_shell.dart';
import '../../presentation/mobile/shells/admin_shell.dart';
import '../../presentation/mobile/navigation/splash_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/order_day/screens/order_day_screen.dart';
import '../../features/attendance/screens/history_screen.dart';
import '../../features/vacations/screens/vacations_screen.dart';
import '../../features/permissions/screens/permissions_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../../features/settings/screens/settings_screen.dart';
import '../../features/info_center/screens/info_center_screen.dart';
import '../../features/work_orders/screens/work_order_list_screen.dart';
import '../../features/clients/screens/client_list_screen.dart';
import '../../features/reports/screens/report_screen.dart';
import '../../features/companies/screens/company_settings_screen.dart';
import '../../features/dashboard/screens/dashboard_screen.dart';
import '../../features/employees/screens/employee_list_screen.dart';
import '../../features/requests/screens/admin_requests_screen.dart';
import '../../features/requests/screens/admin_request_detail_screen.dart';
import '../../features/requests/screens/my_requests_screen.dart';
import '../../features/attendance/screens/live_map_screen.dart';

final mobileRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    redirect: (ctx, state) {
      final auth = ref.read(authStateProvider);
      final loc = state.matchedLocation;
      if (loc == '/splash') return null;
      if (auth == null) return (loc == '/login' || loc == '/register') ? null : '/login';
      final role = auth.role;
      if (loc == '/login' || loc == '/register') {
        if (platformOnlyRoles.contains(role)) return '/login';
        return isAdminLike(role) ? '/admin' : '/home';
      }
      // block platform-only on mobile
      if (platformOnlyRoles.contains(role) && loc.startsWith('/admin')) return '/login';
      if (platformOnlyRoles.contains(role)) return '/login';
      // employee cannot access /admin
      if (role == 'employee' && loc.startsWith('/admin')) return '/home';
      // admin cannot access employee-only
      const employeeOnly = {'/home', '/order-day', '/history'};
      if (isAdminLike(role) && employeeOnly.contains(loc)) return '/admin';
      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (_, _) => const SplashScreen()),
      GoRoute(path: '/login', builder: (_, _) => const LoginScreen()),
      GoRoute(path: '/register', builder: (_, _) => const RegisterScreen()),
      ShellRoute(builder: (_, _, child) => EmployeeShell(child: child), routes: [
        GoRoute(path: '/home', builder: (_, _) => const HomeScreen()),
        GoRoute(path: '/order-day', builder: (_, _) => const OrderDayScreen()),
        GoRoute(path: '/history', builder: (_, _) => const HistoryScreen()),
        GoRoute(path: '/my-requests', builder: (_, _) => const MyRequestsScreen()),
        GoRoute(path: '/vacations', builder: (_, _) => const VacationsScreen()),
        GoRoute(path: '/permissions', builder: (_, _) => const PermissionsScreen()),
        GoRoute(path: '/work-orders', builder: (_, _) => const WorkOrderListScreen()),
        GoRoute(path: '/profile', builder: (_, _) => const ProfileScreen()),
        GoRoute(path: '/settings', builder: (_, _) => const SettingsScreen()),
        GoRoute(path: '/info-center', builder: (_, _) => const InfoCenterScreen()),
      ]),
      ShellRoute(builder: (_, _, child) => AdminShell(child: child), routes: [
        GoRoute(path: '/admin', builder: (_, _) => const DashboardScreen()),
        GoRoute(path: '/admin/team', builder: (_, _) => const EmployeeListScreen()),
        GoRoute(path: '/admin/work-orders', builder: (_, _) => const WorkOrderListScreen()),
        GoRoute(path: '/admin/requests', builder: (_, _) => const AdminRequestsScreen()),
        GoRoute(path: '/admin/requests/:id', builder: (_, s) => AdminRequestDetailScreen(id: s.pathParameters['id']!)),
        GoRoute(path: '/admin/attendance', builder: (_, _) => const LiveMapScreen()),
        GoRoute(path: '/clients', builder: (_, _) => const ClientListScreen()),
        GoRoute(path: '/reports', builder: (_, _) => const ReportScreen()),
        GoRoute(path: '/company-settings', builder: (_, _) => const CompanySettingsScreen()),
      ]),
    ],
  );
});
