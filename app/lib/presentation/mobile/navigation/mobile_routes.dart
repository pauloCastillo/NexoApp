import 'package:go_router/go_router.dart';

import '../../../features/attendance/screens/history_screen.dart';
import '../../../features/home/screens/home_screen.dart';
import '../../../features/info_center/screens/info_center_screen.dart';
import '../../../features/order_day/screens/order_day_screen.dart';
import '../../../features/permissions/screens/permissions_screen.dart';
import '../../../features/profile/screens/profile_screen.dart';
import '../../../features/settings/screens/settings_screen.dart';
import '../../../features/vacations/screens/vacations_screen.dart';

final mobileRoutes = <RouteBase>[
  GoRoute(path: '/home', builder: (_, _) => const HomeScreen()),
  GoRoute(path: '/order-day', builder: (_, _) => const OrderDayScreen()),
  GoRoute(path: '/history', builder: (_, _) => const HistoryScreen()),
  GoRoute(path: '/vacations', builder: (_, _) => const VacationsScreen()),
  GoRoute(path: '/permissions', builder: (_, _) => const PermissionsScreen()),
  GoRoute(path: '/info-center', builder: (_, _) => const InfoCenterScreen()),
  GoRoute(path: '/profile', builder: (_, _) => const ProfileScreen()),
  GoRoute(path: '/settings', builder: (_, _) => const SettingsScreen()),
];