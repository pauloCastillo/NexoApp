import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nexo_app/features/auth/providers/auth_provider.dart';
import 'package:nexo_app/core/auth/auth_state.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  final String? initialCode;
  const RegisterScreen({super.key, this.initialCode});
  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen>
    with SingleTickerProviderStateMixin {
  final _formKey1 = GlobalKey<FormState>();
  final _formKey2 = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _lastName = TextEditingController();
  final _email = TextEditingController();
  final _phone = TextEditingController();
  final _companyName = TextEditingController();
  final _invitationCode = TextEditingController();
  final _password = TextEditingController();
  final _confirm = TextEditingController();

  int _step = 0;
  bool _loading = false;
  bool _obscure1 = true;
  bool _obscure2 = true;
  bool _isEmployee = false;
  String? _invitationPreview; // e.g., Empresa · Depto · Sucursal · Turno
  Map<String, dynamic>? _invitationDetails;
  bool _validatingCode = false;
  bool _canRequestNew = false;
  bool _requestingNew = false;
  String? _errorSummary;
  final _errorFocus = FocusNode();
  late final AnimationController _anim;
  late final Animation<double> _fade;
  late final Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _anim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );
    _fade = CurvedAnimation(parent: _anim, curve: Curves.easeOutCubic);
    _slide = Tween<Offset>(
      begin: const Offset(0, 0.04),
      end: Offset.zero,
    ).animate(_fade);
    if (!WidgetsBinding
        .instance
        .platformDispatcher
        .accessibilityFeatures
        .disableAnimations)
      _anim.forward();
    if (widget.initialCode != null && widget.initialCode!.isNotEmpty) {
      _invitationCode.text = widget.initialCode!.toUpperCase();
      _isEmployee = true;
      WidgetsBinding.instance.addPostFrameCallback(
        (_) => _validateInvitationCode(),
      );
    }
  }

  @override
  void dispose() {
    for (final c in [
      _name,
      _lastName,
      _email,
      _phone,
      _companyName,
      _invitationCode,
      _password,
      _confirm,
    ]) {
      c.dispose();
    }
    _errorFocus.dispose();
    _anim.dispose();
    super.dispose();
  }

  String? _req(String? v, String label) =>
      (v == null || v.trim().isEmpty) ? '$label requerido' : null;
  String? _emailV(String? v) {
    if (v == null || v.trim().isEmpty) return 'Correo requerido';
    if (!RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(v.trim()))
      return 'Correo no válido';
    return null;
  }

  bool _validateStep0() {
    final ok = _formKey1.currentState?.validate() ?? false;
    if (!ok) setState(() => _errorSummary = 'Corrige los campos del paso 1');
    if (!ok) _errorFocus.requestFocus();
    return ok;
  }

  Future<void> _validateInvitationCode() async {
    final code = _invitationCode.text.trim().toUpperCase();
    if (code.isEmpty) {
      setState(() {
        _invitationPreview = null;
        _invitationDetails = null;
        _canRequestNew = false;
      });
      return;
    }
    setState(() {
      _validatingCode = true;
      _invitationPreview = null;
      _invitationDetails = null;
      _canRequestNew = false;
    });
    try {
      final res = await ref
          .read(authRepositoryProvider)
          .validateInvitation(code);
      final company = res['company'] as Map<String, dynamic>?;
      final dept = res['department'] as Map<String, dynamic>?;
      final branch = res['branch'] as Map<String, dynamic>?;
      final shift = res['shift'] as String?;
      final parts = [
        if (company?['name'] != null) company!['name'],
        if (dept?['name'] != null) dept!['name'],
        if (branch?['name'] != null) branch!['name'],
        if (shift != null) shift,
      ];
      setState(() {
        _invitationPreview = parts.join(' · ');
        _invitationDetails = res;
      });
    } catch (e) {
      final msg = e.toString();
      final canRequest =
          msg.contains('expirado') ||
          msg.contains('inválido') ||
          msg.contains('inválido o expirado');
      setState(() {
        _invitationPreview = null;
        _invitationDetails = null;
        _canRequestNew = canRequest;
      });
    } finally {
      if (mounted) setState(() => _validatingCode = false);
    }
  }

  Future<void> _requestNewCode() async {
    final code = _invitationCode.text.trim().toUpperCase();
    if (code.isEmpty) return;
    setState(() => _requestingNew = true);
    try {
      await ref
          .read(authRepositoryProvider)
          .requestNewCode(
            code,
            email: _email.text.trim().isNotEmpty ? _email.text.trim() : null,
          );
      if (mounted)
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Si el código existe, el administrador fue notificado',
            ),
          ),
        );
    } catch (e) {
      if (mounted)
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() => _requestingNew = false);
    }
  }

  bool _validateStep1() {
    final errors = <String>[];
    if (_isEmployee && _invitationCode.text.trim().isEmpty)
      errors.add('Código de invitación requerido');
    if (!_isEmployee && _companyName.text.trim().isEmpty)
      errors.add('Nombre de empresa requerido');
    final p1 = _password.text;
    final p2 = _confirm.text;
    if (p1.isEmpty) errors.add('Contraseña requerida');
    if (p1.length < 6) errors.add('Contraseña mínimo 6 caracteres');
    if (p1 != p2) errors.add('Las contraseñas no coinciden');
    final formOk = _formKey2.currentState?.validate() ?? false;
    if (errors.isNotEmpty || !formOk) {
      setState(
        () => _errorSummary = errors.isNotEmpty
            ? errors.first
            : 'Corrige los campos del paso 2',
      );
      _errorFocus.requestFocus();
      return false;
    }
    return true;
  }

  void _next() {
    if (_step == 0 && _validateStep0()) {
      setState(() {
        _step = 1;
        _errorSummary = null;
      });
      _anim.forward(from: 0);
    }
  }

  void _back() => setState(() {
    _step = 0;
    _errorSummary = null;
  });

  Future<void> _register() async {
    if (!_validateStep1()) return;
    // re-validate code before submit to give fresh preview
    if (_isEmployee) await _validateInvitationCode();
    setState(() {
      _loading = true;
      _errorSummary = null;
    });
    try {
      final username = '${_name.text.trim()} ${_lastName.text.trim()}';
      final user = await ref
          .read(authRepositoryProvider)
          .register(
            username,
            _email.text.trim(),
            _password.text,
            role: _isEmployee ? 'employee' : 'business_owner',
            companyName: _isEmployee ? null : _companyName.text.trim(),
            invitationCode: _isEmployee
                ? _invitationCode.text.trim().toUpperCase()
                : null,
            phone: _phone.text.trim().isNotEmpty
                ? '+591-${_phone.text.trim()}'
                : null,
          );
      ref.read(authStateProvider.notifier).state = AuthState(
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registro exitoso. ¡Bienvenido!')),
        );
        context.go('/');
      }
    } catch (e) {
      final msg = e.toString().replaceAll('Exception: ', '');
      setState(() {
        if (msg.contains('409') || msg.contains('Ya existe')) {
          _errorSummary =
              'Ya existe un usuario con esos datos, inicia sesión si eres tú';
        } else {
          _errorSummary = msg;
        }
      });
      _errorFocus.requestFocus();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, c) {
            final isWide = c.maxWidth >= 900;
            if (isWide) {
              return Row(
                children: [
                  Expanded(child: _brandPanel(cs, isWide: true)),
                  Expanded(
                    child: Center(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(24),
                        child: _formCard(cs),
                      ),
                    ),
                  ),
                ],
              );
            }
            return SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _brandPanel(cs, isWide: false),
                  const SizedBox(height: 16),
                  _formCard(cs),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _brandPanel(ColorScheme cs, {required bool isWide}) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF00A99D), Color(0xFF0F2A4A), Color(0xFF1A3A5A)],
        ),
        borderRadius: isWide ? null : BorderRadius.circular(20),
      ),
      padding: EdgeInsets.all(isWide ? 40 : 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: isWide
            ? MainAxisAlignment.center
            : MainAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.hub, color: Colors.white, size: 28),
              ),
              const SizedBox(width: 12),
              const Text(
                'Nexo',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
          SizedBox(height: isWide ? 28 : 16),
          Text(
            'Crea tu cuenta\nen minutos',
            style: TextStyle(
              color: Colors.white,
              fontSize: isWide ? 26 : 20,
              fontWeight: FontWeight.w700,
              height: 1.1,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'Dueños crean su empresa. Colaboradores se unen a una existente.',
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.85),
              fontSize: 13,
              height: 1.5,
            ),
          ),
          SizedBox(height: isWide ? 24 : 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _chip(Icons.business, 'Empresa + sucursales'),
              _chip(Icons.people, 'Roles y permisos'),
              _chip(Icons.verified, 'Seguro y escalable'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _chip(IconData i, String l) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: 0.14),
      borderRadius: BorderRadius.circular(20),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(i, size: 14, color: Colors.white),
        const SizedBox(width: 6),
        Text(l, style: const TextStyle(color: Colors.white, fontSize: 12)),
      ],
    ),
  );

  Widget _formCard(ColorScheme cs) {
    final card = ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 520),
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Crear cuenta',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: cs.onSurface,
                      ),
                    ),
                  ),
                  Text(
                    'Paso ${_step + 1} de 2',
                    style: TextStyle(
                      fontSize: 12,
                      color: cs.onSurfaceVariant,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: (_step + 1) / 2,
                  minHeight: 6,
                  backgroundColor: cs.surfaceContainerHighest,
                  color: cs.primary,
                ),
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  _stepDot(0, cs, done: _step > 0),
                  Expanded(
                    child: Container(
                      height: 2,
                      color: _step > 0
                          ? cs.primary
                          : cs.outline.withValues(alpha: 0.3),
                    ),
                  ),
                  _stepDot(1, cs, done: false),
                ],
              ),
              const SizedBox(height: 16),
              // role toggle — SegmentedButton semantics
              Semantics(
                header: true,
                child: Text(
                  'Tipo de cuenta',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: cs.onSurfaceVariant,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              SegmentedButton<bool>(
                segments: const [
                  ButtonSegment(
                    value: false,
                    label: Text('Dueño'),
                    icon: Icon(Icons.storefront, size: 16),
                  ),
                  ButtonSegment(
                    value: true,
                    label: Text('Colaborador'),
                    icon: Icon(Icons.badge, size: 16),
                  ),
                ],
                selected: {_isEmployee},
                onSelectionChanged: (s) => setState(() {
                  _isEmployee = s.first;
                  _invitationPreview = null;
                  if (_isEmployee) {
                    _companyName.clear();
                  } else {
                    _invitationCode.clear();
                    _invitationPreview = null;
                  }
                  _errorSummary = null;
                }),
                style: ButtonStyle(visualDensity: VisualDensity.comfortable),
                showSelectedIcon: false,
              ),
              const SizedBox(height: 16),
              if (_errorSummary != null)
                Semantics(
                  liveRegion: true,
                  child: Focus(
                    focusNode: _errorFocus,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: cs.errorContainer,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.error_outline, color: cs.error, size: 18),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _errorSummary!,
                              style: TextStyle(
                                color: cs.onErrorContainer,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              if (_errorSummary != null) const SizedBox(height: 16),
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 250),
                child: _step == 0 ? _stepOne(cs) : _stepTwo(cs),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  if (_step == 1) ...[
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _loading ? null : _back,
                        child: const Text('Atrás'),
                      ),
                    ),
                    const SizedBox(width: 12),
                  ],
                  Expanded(
                    flex: 2,
                    child: SizedBox(
                      height: 48,
                      child: FilledButton(
                        onPressed: _loading
                            ? null
                            : (_step == 0 ? _next : _register),
                        child: _loading
                            ? const SizedBox(
                                height: 18,
                                width: 18,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : Text(_step == 0 ? 'Continuar' : 'Crear cuenta'),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Wrap(
                alignment: WrapAlignment.center,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  Text(
                    '¿Ya tienes cuenta? ',
                    style: TextStyle(fontSize: 13, color: cs.onSurfaceVariant),
                  ),
                  TextButton(
                    onPressed: () => context.go('/login'),
                    child: const Text(
                      'Ingresa aquí',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
    return FadeTransition(
      opacity: _fade,
      child: SlideTransition(position: _slide, child: card),
    );
  }

  Widget _stepDot(int idx, ColorScheme cs, {required bool done}) {
    final active = _step == idx;
    final bg = done
        ? cs.primary
        : (active ? cs.primary : cs.outline.withValues(alpha: 0.3));
    final fg = done || active ? Colors.white : cs.onSurfaceVariant;
    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
      child: Center(
        child: done
            ? const Icon(Icons.check, size: 16, color: Colors.white)
            : Text(
                '${idx + 1}',
                style: TextStyle(
                  color: fg,
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                ),
              ),
      ),
    );
  }

  Widget _stepOne(ColorScheme cs) {
    return Form(
      key: _formKey1,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        key: const ValueKey(0),
        children: [
          Semantics(
            header: true,
            child: Text(
              'Datos personales',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: cs.primary,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _name,
                  autofillHints: const [AutofillHints.givenName],
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(
                    labelText: 'Nombre',
                    prefixIcon: Icon(Icons.person_outline, size: 20),
                  ),
                  validator: (v) => _req(v, 'Nombre'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextFormField(
                  controller: _lastName,
                  autofillHints: const [AutofillHints.familyName],
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(
                    labelText: 'Apellido',
                    prefixIcon: Icon(Icons.person, size: 20),
                  ),
                  validator: (v) => _req(v, 'Apellido'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _email,
            autofillHints: const [AutofillHints.email],
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              labelText: 'Correo electrónico',
              prefixIcon: Icon(Icons.email_outlined, size: 20),
              helperText: 'Usa tu correo de trabajo',
            ),
            validator: _emailV,
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _phone,
            autofillHints: const [AutofillHints.telephoneNumber],
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(
              labelText: 'Celular',
              prefixIcon: Icon(Icons.phone_outlined, size: 20),
              hintText: '77777777',
              helperText: 'Opcional',
            ),
            validator: (_) => null,
          ),
        ],
      ),
    );
  }

  Widget _stepTwo(ColorScheme cs) {
    return Form(
      key: _formKey2,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        key: const ValueKey(1),
        children: [
          Semantics(
            header: true,
            child: Text(
              _isEmployee ? 'Código de invitación' : 'Datos de la empresa',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: cs.primary,
              ),
            ),
          ),
          const SizedBox(height: 12),
          if (_isEmployee) ...[
            TextFormField(
              controller: _invitationCode,
              textCapitalization: TextCapitalization.characters,
              decoration: InputDecoration(
                labelText: 'Código de invitación',
                hintText: 'Ej: A1B2C3D4',
                prefixIcon: const Icon(
                  Icons.confirmation_number_outlined,
                  size: 20,
                ),
                helperText: _invitationPreview != null
                    ? 'Empresa: $_invitationPreview'
                    : 'Solicítalo a tu administrador',
                helperStyle: TextStyle(
                  color: _invitationPreview != null ? cs.primary : null,
                ),
                suffixIcon: _validatingCode
                    ? const Padding(
                        padding: EdgeInsets.all(12),
                        child: SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                      )
                    : IconButton(
                        icon: const Icon(Icons.check_circle_outline, size: 20),
                        tooltip: 'Validar código',
                        onPressed: _validateInvitationCode,
                      ),
              ),
              onFieldSubmitted: (_) => _validateInvitationCode(),
              onChanged: (_) => setState(() => _invitationPreview = null),
              validator: (v) => _isEmployee && (v == null || v.trim().isEmpty)
                  ? 'Código requerido'
                  : null,
            ),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton.icon(
                icon: const Icon(Icons.qr_code_scanner, size: 16),
                label: const Text(
                  'Escanear QR (opcional)',
                  style: TextStyle(fontSize: 12),
                ),
                onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text(
                      'QR scan: instala mobile_scanner para habilitar',
                    ),
                  ),
                ),
              ),
            ),
            if (_invitationPreview != null)
              Container(
                margin: const EdgeInsets.only(top: 8),
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: cs.primaryContainer.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.business,
                      size: 16,
                      color: cs.onPrimaryContainer,
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        _invitationPreview!,
                        style: TextStyle(
                          fontSize: 12,
                          color: cs.onPrimaryContainer,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            if (_canRequestNew)
              Container(
                margin: const EdgeInsets.only(top: 8),
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: cs.errorContainer.withValues(alpha: 0.7),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 16,
                      color: cs.onErrorContainer,
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Código inválido o expirado',
                        style: TextStyle(
                          fontSize: 12,
                          color: cs.onErrorContainer,
                        ),
                      ),
                    ),
                    TextButton(
                      onPressed: _requestingNew ? null : _requestNewCode,
                      child: _requestingNew
                          ? const SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text(
                              'Solicitar nuevo',
                              style: TextStyle(fontSize: 12),
                            ),
                    ),
                  ],
                ),
              ),
          ] else
            TextFormField(
              controller: _companyName,
              textCapitalization: TextCapitalization.words,
              decoration: const InputDecoration(
                labelText: 'Nombre de empresa',
                prefixIcon: Icon(Icons.business_outlined, size: 20),
                helperText: 'Se creará tu empresa con este nombre',
              ),
              validator: (v) => _req(v, 'Empresa'),
            ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _password,
            autofillHints: const [AutofillHints.newPassword],
            obscureText: _obscure1,
            decoration: InputDecoration(
              labelText: 'Contraseña',
              prefixIcon: const Icon(Icons.lock_outline, size: 20),
              helperText: 'Mínimo 6 caracteres',
              suffixIcon: IconButton(
                icon: Icon(
                  _obscure1
                      ? Icons.visibility_off_outlined
                      : Icons.visibility_outlined,
                  size: 20,
                ),
                onPressed: () => setState(() => _obscure1 = !_obscure1),
              ),
            ),
            validator: (v) =>
                (v == null || v.length < 6) ? 'Mínimo 6 caracteres' : null,
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _confirm,
            autofillHints: const [AutofillHints.newPassword],
            obscureText: _obscure2,
            onFieldSubmitted: (_) => _register(),
            decoration: InputDecoration(
              labelText: 'Confirmar contraseña',
              prefixIcon: const Icon(Icons.lock, size: 20),
              suffixIcon: IconButton(
                icon: Icon(
                  _obscure2
                      ? Icons.visibility_off_outlined
                      : Icons.visibility_outlined,
                  size: 20,
                ),
                onPressed: () => setState(() => _obscure2 = !_obscure2),
              ),
            ),
            validator: (v) => v != _password.text ? 'No coinciden' : null,
          ),
        ],
      ),
    );
  }
}
