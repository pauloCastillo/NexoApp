import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/auth/auth_state.dart';
import '../../../core/auth/role_guards.dart';
import '../../../core/auth/token_service.dart';
import '../../../features/auth/providers/auth_provider.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  final _tokenService = TokenService();

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    if (!await _tokenService.isAuthenticated()) {
      if (!mounted) return;
      context.go('/login');
      return;
    }
    try {
      final user = await ref.read(authRepositoryProvider).getProfile();
      ref.read(authStateProvider.notifier).state = AuthState(
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      );
      if (!mounted) return;
      if (isPlatformOnly(user.role)) { context.go('/login'); return; }
      context.go(isAdminLike(user.role) ? '/admin' : '/home');
    } catch (_) {
      await _tokenService.clearTokens();
      if (!mounted) return;
      context.go('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE8612C),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('N', style: TextStyle(fontSize: 72, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 16),
            const Text('Nexo', style: TextStyle(fontSize: 28, color: Colors.white)),
            const SizedBox(height: 8),
            const Text('Tu oficina de confianza', style: TextStyle(fontSize: 14, color: Colors.white70)),
            const SizedBox(height: 48),
            const CircularProgressIndicator(color: Colors.white),
          ],
        ),
      ),
    );
  }
}