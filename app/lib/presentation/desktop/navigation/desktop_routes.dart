import 'package:go_router/go_router.dart';

import '../../../features/auth/screens/login_screen.dart';
import '../../../features/auth/screens/register_screen.dart';
import '../../../features/clients/screens/client_list_screen.dart';
import '../../../features/companies/screens/company_settings_screen.dart';
import '../../../features/dashboard/screens/dashboard_screen.dart';
import '../../../features/employees/screens/employee_list_screen.dart';
import '../../../features/reports/screens/report_screen.dart';
import '../../../features/work_orders/screens/work_order_list_screen.dart';

final desktopRoutes = <RouteBase>[
  GoRoute(path: '/login', builder: (_, _) => const LoginScreen()),
  GoRoute(path: '/register', builder: (_, _) => const RegisterScreen()),
  GoRoute(path: '/', builder: (_, _) => const DashboardScreen()),
  GoRoute(path: '/employees', builder: (_, _) => const EmployeeListScreen()),
  GoRoute(path: '/work-orders', builder: (_, _) => const WorkOrderListScreen()),
  GoRoute(path: '/clients', builder: (_, _) => const ClientListScreen()),
  GoRoute(path: '/reports', builder: (_, _) => const ReportScreen()),
  GoRoute(path: '/dashboard', builder: (_, _) => const DashboardScreen()),
  GoRoute(path: '/company-settings', builder: (_, _) => const CompanySettingsScreen()),
];