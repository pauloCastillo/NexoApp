import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nexo_app/features/auth/providers/auth_provider.dart';
import 'package:nexo_app/core/auth/auth_state.dart';
import 'package:nexo_app/core/auth/role_guards.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    setState(() => _loading = true);
    try {
      final user = await ref
          .read(authRepositoryProvider)
          .login(_emailController.text.trim(), _passwordController.text);
      ref.read(authStateProvider.notifier).state = AuthState(
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      );
      if (mounted) {
        if (isPlatformOnly(user.role)) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Usa la versión desktop para este rol')));
          context.go('/login');
        } else if (isAdminLike(user.role)) {
          context.go('/admin');
        } else {
          context.go('/home');
        }
      }
    } catch (e) {
      if (mounted) {
        final msg = e.toString();
        String friendly;
        if (msg.contains('404') || msg.contains('No encontramos una cuenta')) {
          friendly = 'No encontramos una cuenta con ese correo electrónico. Verifica e intenta de nuevo.';
        } else if (msg.contains('401') || msg.contains('Contraseña incorrecta')) {
          friendly = 'La contraseña ingresada no es correcta. Intenta de nuevo.';
        } else {
          friendly = msg;
        }
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(friendly)));
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SizedBox(
          width: 400,
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Nexo',
                    style: Theme.of(context).textTheme.headlineLarge,
                  ),
                  const SizedBox(height: 32),
                  TextField(
                    controller: _emailController,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      prefixIcon: Icon(Icons.email),
                    ),
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _passwordController,
                    decoration: const InputDecoration(
                      labelText: 'Contraseña',
                      prefixIcon: Icon(Icons.lock),
                    ),
                    obscureText: true,
                    onSubmitted: (_) => _login(),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: FilledButton(
                      onPressed: _loading ? null : _login,
                      child: _loading
                          ? const CircularProgressIndicator()
                          : const Text('Iniciar sesión'),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    alignment: WrapAlignment.center,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      Text(
                        '¿No tienes una cuenta? ',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      TextButton(
                        onPressed: () {
                          if (context.mounted) context.go('/register');
                        },
                        style: TextButton.styleFrom(
                          enabledMouseCursor: SystemMouseCursors.click,
                        ),
                        child: const Text(
                          'Regístrate',
                          style: TextStyle(fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
