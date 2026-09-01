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

class _LoginScreenState extends ConsumerState<LoginScreen> with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _emailFocus = FocusNode();
  final _passwordFocus = FocusNode();
  final _errorSummaryFocus = FocusNode();
  bool _loading = false;
  bool _obscure = true;
  String? _errorSummary;
  String? _emailError;
  String? _passwordError;

  late final AnimationController _animCtrl;
  late final Animation<double> _fade;
  late final Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 400));
    _fade = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic, reverseCurve: Curves.easeInCubic);
    _slide = Tween<Offset>(begin: const Offset(0, 0.06), end: Offset.zero).animate(CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic));
    final reduceMotion = WidgetsBinding.instance.platformDispatcher.accessibilityFeatures.disableAnimations;
    if (!reduceMotion) _animCtrl.forward();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _emailFocus.dispose();
    _passwordFocus.dispose();
    _errorSummaryFocus.dispose();
    _animCtrl.dispose();
    super.dispose();
  }

  String? _validateEmail(String? v) {
    if (v == null || v.trim().isEmpty) return 'Ingresa tu correo';
    if (!RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(v.trim())) return 'Correo no válido';
    return null;
  }

  String? _validatePassword(String? v) {
    if (v == null || v.isEmpty) return 'Ingresa tu contraseña';
    if (v.length < 6) return 'Mínimo 6 caracteres';
    return null;
  }

  Future<void> _login() async {
    final eErr = _validateEmail(_emailController.text);
    final pErr = _validatePassword(_passwordController.text);
    setState(() {
      _emailError = eErr;
      _passwordError = pErr;
      _errorSummary = null;
    });
    if (eErr != null || pErr != null) {
      setState(() => _errorSummary = 'Corrige los campos marcados');
      _errorSummaryFocus.requestFocus();
      return;
    }
    setState(() => _loading = true);
    try {
      final user = await ref.read(authRepositoryProvider).login(_emailController.text.trim(), _passwordController.text);
      ref.read(authStateProvider.notifier).state = AuthState(
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      );
      if (!mounted) return;
      if (isPlatformOnly(user.role)) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Usa la versión desktop para este rol')));
        context.go('/login');
      } else if (isAdminLike(user.role)) {
        context.go('/admin');
      } else {
        context.go('/home');
      }
    } catch (e) {
      if (!mounted) return;
      final msg = e.toString();
      String friendly;
      String? field;
      if (msg.contains('404') || msg.contains('No encontramos una cuenta')) {
        friendly = 'No encontramos una cuenta con ese correo. Verifica e intenta de nuevo.';
        field = 'email';
      } else if (msg.contains('401') || msg.contains('Contraseña incorrecta')) {
        friendly = 'La contraseña no es correcta. Intenta de nuevo.';
        field = 'password';
      } else {
        friendly = msg.replaceAll('Exception: ', '');
      }
      setState(() {
        _errorSummary = friendly;
        if (field == 'email') _emailError = friendly;
        if (field == 'password') _passwordError = friendly;
      });
      _errorSummaryFocus.requestFocus();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(builder: (context, constraints) {
          final isWide = constraints.maxWidth >= 900;
          if (isWide) {
            return Row(children: [
              Expanded(child: _buildBrandPanel(cs, isWide: true)),
              Expanded(child: Center(child: _buildFormCard(cs))),
            ]);
          }
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(children: [
              _buildBrandPanel(cs, isWide: false),
              const SizedBox(height: 16),
              _buildFormCard(cs),
            ]),
          );
        }),
      ),
    );
  }

  Widget _buildBrandPanel(ColorScheme cs, {required bool isWide}) {
    // J2 palette: aqua teal -> navy gradient, trust + enterprise
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [const Color(0xFF00A99D), const Color(0xFF0F2A4A), const Color(0xFF1A3A5A)],
        ),
        borderRadius: isWide ? null : BorderRadius.circular(20),
      ),
      padding: EdgeInsets.all(isWide ? 40 : 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: isWide ? MainAxisAlignment.center : MainAxisAlignment.start,
        children: [
          Row(children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.white.withValues(alpha: 0.2))),
              child: const Icon(Icons.hub, color: Colors.white, size: 28),
            ),
            const SizedBox(width: 12),
            const Text('Nexo', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800, letterSpacing: -0.5)),
          ]),
          SizedBox(height: isWide ? 32 : 16),
          Text(
            'Controla tu workforce\nen un solo lugar',
            style: TextStyle(color: Colors.white, fontSize: isWide ? 28 : 22, fontWeight: FontWeight.w700, height: 1.1),
          ),
          const SizedBox(height: 12),
          Text('Asistencias, órdenes, permisos y reportes. Diseñado para equipos operativos.', style: TextStyle(color: Colors.white.withValues(alpha: 0.85), fontSize: 14, height: 1.5)),
          SizedBox(height: isWide ? 32 : 20),
          Wrap(spacing: 8, runSpacing: 8, children: [
            _brandChip(Icons.access_time, 'Asistencia en tiempo real'),
            _brandChip(Icons.assignment, 'Órdenes de trabajo'),
            _brandChip(Icons.analytics, 'Reportes claros'),
          ]),
          if (!isWide) const SizedBox(height: 8),
          if (isWide) ...[
            const SizedBox(height: 32),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.white.withValues(alpha: 0.18))),
              child: Row(children: [
                const Icon(Icons.verified_user, color: Color(0xFFFFC857), size: 20),
                const SizedBox(width: 10),
                Expanded(child: Text('Seguridad empresarial • Roles y sucursales • Datos en tiempo real', style: TextStyle(color: Colors.white.withValues(alpha: 0.9), fontSize: 12))),
              ]),
            ),
          ],
        ],
      ),
    );
  }

  Widget _brandChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.14), borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.white.withValues(alpha: 0.16))),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon, size: 14, color: Colors.white),
        const SizedBox(width: 6),
        Text(label, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w500)),
      ]),
    );
  }

  Widget _buildFormCard(ColorScheme cs) {
    final content = ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 440),
      child: Card(
        elevation: 0,
        margin: const EdgeInsets.all(4),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Bienvenido de nuevo', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: cs.onSurface)),
                const SizedBox(height: 6),
                Text('Inicia sesión para continuar', style: TextStyle(fontSize: 14, color: cs.onSurfaceVariant)),
                const SizedBox(height: 20),
                if (_errorSummary != null)
                  Semantics(
                    liveRegion: true,
                    child: Focus(
                      focusNode: _errorSummaryFocus,
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: cs.errorContainer, borderRadius: BorderRadius.circular(12), border: Border.all(color: cs.error.withValues(alpha: 0.2))),
                        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Icon(Icons.error_outline, color: cs.error, size: 18),
                          const SizedBox(width: 8),
                          Expanded(child: Text(_errorSummary!, style: TextStyle(color: cs.onErrorContainer, fontSize: 13))),
                        ]),
                      ),
                    ),
                  ),
                if (_errorSummary != null) const SizedBox(height: 16),
                TextFormField(
                  controller: _emailController,
                  focusNode: _emailFocus,
                  autofillHints: const [AutofillHints.email],
                  keyboardType: TextInputType.emailAddress,
                  textInputAction: TextInputAction.next,
                  onFieldSubmitted: (_) => _passwordFocus.requestFocus(),
                  onChanged: (_) => setState(() => _emailError = null),
                  decoration: InputDecoration(
                    labelText: 'Correo electrónico',
                    hintText: 'tu@empresa.com',
                    prefixIcon: const Icon(Icons.email_outlined, size: 20),
                    errorText: _emailError,
                  ),
                  validator: _validateEmail,
                  autovalidateMode: AutovalidateMode.onUserInteraction,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passwordController,
                  focusNode: _passwordFocus,
                  autofillHints: const [AutofillHints.password],
                  obscureText: _obscure,
                  textInputAction: TextInputAction.done,
                  onFieldSubmitted: (_) => _login(),
                  onChanged: (_) => setState(() => _passwordError = null),
                  decoration: InputDecoration(
                    labelText: 'Contraseña',
                    prefixIcon: const Icon(Icons.lock_outline, size: 20),
                    errorText: _passwordError,
                    suffixIcon: IconButton(
                      tooltip: _obscure ? 'Mostrar contraseña' : 'Ocultar contraseña',
                      icon: Icon(_obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 20),
                      onPressed: () => setState(() => _obscure = !_obscure),
                    ),
                  ),
                  validator: _validatePassword,
                  autovalidateMode: AutovalidateMode.onUserInteraction,
                ),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(onPressed: () {}, child: const Text('¿Olvidaste tu contraseña?', style: TextStyle(fontSize: 12))),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  height: 48,
                  child: FilledButton(
                    onPressed: _loading ? null : _login,
                    child: _loading ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Text('Iniciar sesión'),
                  ),
                ),
                const SizedBox(height: 14),
                // ponytail: biometric hook for future local_auth — no dep yet
                Semantics(
                  label: 'Próximamente inicio con biometría',
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(color: cs.surfaceContainerHighest.withValues(alpha: 0.5), borderRadius: BorderRadius.circular(12), border: Border.all(color: cs.outline.withValues(alpha: 0.5))),
                    child: Row(children: [
                      Icon(Icons.fingerprint, size: 18, color: cs.onSurfaceVariant),
                      const SizedBox(width: 8),
                      Expanded(child: Text('Próximamente: Huella / Face ID', style: TextStyle(fontSize: 12, color: cs.onSurfaceVariant))),
                      Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: cs.outline.withValues(alpha: 0.3), borderRadius: BorderRadius.circular(20)), child: Text('Pronto', style: TextStyle(fontSize: 10, color: cs.onSurfaceVariant))),
                    ]),
                  ),
                ),
                const SizedBox(height: 16),
                Wrap(
                  alignment: WrapAlignment.center,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    Text('¿No tienes cuenta? ', style: TextStyle(fontSize: 13, color: cs.onSurfaceVariant)),
                    TextButton(
                      onPressed: () => context.go('/register'),
                      style: TextButton.styleFrom(enabledMouseCursor: SystemMouseCursors.click),
                      child: const Text('Regístrate', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );

    // motion: fade + slide, respects reduced-motion via controller init
    return FadeTransition(
      opacity: _fade,
      child: SlideTransition(position: _slide, child: content),
    );
  }
}
