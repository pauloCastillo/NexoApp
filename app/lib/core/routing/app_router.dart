import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../auth/auth_state.dart';
import '../../presentation/desktop/navigation/desktop_routes.dart';
import '../../presentation/mobile/navigation/mobile_routes.dart';
import '../../presentation/mobile/navigation/splash_screen.dart';
import '../../features/auth/screens/register_screen.dart';

final goRouterProvider = Provider<GoRouter>((ref) {
  final router = GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final authState = ref.read(authStateProvider);
      final path = state.matchedLocation;
      final logged = authState != null;
      final role = authState?.role;
      final isEmployee = role == 'employee';
      final isManager = role != null && adminLikeRoles.contains(role) && !platformOnlyRoles.contains(role);
      final authRoute = path == '/splash' || path == '/login' || path == '/register' || path.startsWith('/invite');

      if (path == '/splash') return null;
      if (!logged) return authRoute ? null : '/login';
      if (authRoute) return isEmployee ? '/home' : '/';

      const shared = {'/work-orders', '/clients', '/reports', '/dashboard'};
      const employeeOnly = {
        '/home', '/order-day', '/history', '/vacations', '/permissions',
        '/info-center', '/profile', '/settings',
      };
      const managerOnly = {'/', '/employees', '/company-settings'};

      if (isEmployee && !shared.contains(path) && !employeeOnly.contains(path)) return '/home';
      if (isManager && !shared.contains(path) && !managerOnly.contains(path)) return '/';
      if (!isEmployee && !isManager) return '/login';
      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (_, _) => const SplashScreen()),
      GoRoute(path: '/invite/:code', builder: (_, s) => RegisterScreen(initialCode: s.pathParameters['code'])),
      ...desktopRoutes,
      ...mobileRoutes,
    ],
  );
  ref.onDispose(router.dispose);
  return router;
});