import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nexo_app/data/models/company_model.dart';
import 'package:nexo_app/features/auth/providers/auth_provider.dart';
import 'package:nexo_app/core/auth/auth_state.dart';
import 'package:nexo_app/features/companies/providers/company_provider.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _nameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _companyNameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _loading = false;
  String? _errorMessage;
  bool _isEmployee = false;
  CompanyModel? _selectedCompany;

  @override
  void dispose() {
    _nameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _companyNameController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    final name = _nameController.text.trim();
    final lastName = _lastNameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    final confirm = _confirmPasswordController.text;
    final phone = _phoneController.text.trim();

    if (name.isEmpty || lastName.isEmpty || email.isEmpty || password.isEmpty || confirm.isEmpty) {
      setState(() => _errorMessage = 'Por favor completa todos los campos');
      return;
    }
    if (password != confirm) {
      setState(() => _errorMessage = 'Revisa que las contraseñas coincidan');
      return;
    }
    if (password.length < 6) {
      setState(() => _errorMessage = 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (_isEmployee) {
      if (_selectedCompany == null) {
        setState(() => _errorMessage = 'Selecciona una empresa');
        return;
      }
    } else {
      if (_companyNameController.text.trim().isEmpty) {
        setState(() => _errorMessage = 'Introduce el nombre de la empresa');
        return;
      }
    }

    setState(() {
      _loading = true;
      _errorMessage = null;
    });

    try {
      final username = '$name $lastName';
      final user = await ref.read(authRepositoryProvider).register(
        username,
        email,
        password,
        role: _isEmployee ? 'employee' : 'business_owner',
        companyName: _isEmployee ? _selectedCompany!.name : _companyNameController.text.trim(),
        companyId: _isEmployee ? _selectedCompany!.id : null,
        phone: phone.isNotEmpty ? '+591-$phone' : null,
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
      if (mounted) {
        final msg = e.toString();
        if (msg.contains('409') || msg.contains('Ya existe un usuario registrado')) {
          setState(() => _errorMessage = 'Ya existe un usuario registrado con esos datos, inicie sesión si es usted');
        } else if (msg.contains('409') && msg.contains('empresa ya está registrada')) {
          setState(() => _errorMessage = 'La empresa ya está registrada');
        } else {
          setState(() => _errorMessage = msg);
        }
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final companiesAsync = ref.watch(publicCompaniesProvider);

    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          child: SizedBox(
            width: 480,
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Text(
                      'Crear Cuenta',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Regístrate en Nexo',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey[600]),
                    ),
                    const SizedBox(height: 24),

                    _buildRoleToggle(),
                    const SizedBox(height: 16),

                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _nameController,
                            decoration: const InputDecoration(
                              labelText: 'Nombre',
                              prefixIcon: Icon(Icons.person),
                            ),
                            textCapitalization: TextCapitalization.words,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _lastNameController,
                            decoration: const InputDecoration(
                              labelText: 'Apellido',
                              prefixIcon: Icon(Icons.person_outline),
                            ),
                            textCapitalization: TextCapitalization.words,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    TextField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        labelText: 'Correo Electrónico',
                        prefixIcon: Icon(Icons.email),
                      ),
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 16),

                    TextField(
                      controller: _phoneController,
                      decoration: const InputDecoration(
                        labelText: 'Celular',
                        prefixIcon: Icon(Icons.phone),
                        hintText: '77777777',
                      ),
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: 16),

                    if (_isEmployee)
                      _buildCompanyDropdown(companiesAsync)
                    else
                      TextField(
                        controller: _companyNameController,
                        decoration: const InputDecoration(
                          labelText: 'Nombre de Empresa',
                          prefixIcon: Icon(Icons.business),
                        ),
                        textCapitalization: TextCapitalization.words,
                      ),
                    const SizedBox(height: 16),

                    TextField(
                      controller: _passwordController,
                      decoration: const InputDecoration(
                        labelText: 'Contraseña',
                        prefixIcon: Icon(Icons.lock),
                      ),
                      obscureText: true,
                    ),
                    const SizedBox(height: 16),

                    TextField(
                      controller: _confirmPasswordController,
                      decoration: const InputDecoration(
                        labelText: 'Confirmar Contraseña',
                        prefixIcon: Icon(Icons.lock_outline),
                      ),
                      obscureText: true,
                      onSubmitted: (_) => _register(),
                    ),

                    if (_errorMessage != null) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.red[50],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.error_outline, color: Colors.red[700], size: 20),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _errorMessage!,
                                style: TextStyle(color: Colors.red[700], fontSize: 13),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                    const SizedBox(height: 24),

                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: FilledButton(
                        style: ButtonStyle(
                          backgroundColor: WidgetStateProperty.resolveWith((states) {
                            if (states.contains(WidgetState.disabled)) return Colors.grey[400];
                            return Theme.of(context).primaryColor;
                          }),
                        ),
                        onPressed: _loading ? null : _register,
                        child: _loading
                            ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                            : const Text('Registrarse'),
                      ),
                    ),
                    const SizedBox(height: 16),

                    Wrap(
                      alignment: WrapAlignment.center,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: [
                        Text('¿Si ya tienes una cuenta? ', style: Theme.of(context).textTheme.bodySmall),
                        TextButton(
                          onPressed: () {
                            if (context.mounted) context.go('/login');
                          },
                          style: TextButton.styleFrom(enabledMouseCursor: SystemMouseCursors.click),
                          child: const Text('Ingresa aquí', style: TextStyle(fontSize: 12)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRoleToggle() {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() {
                _isEmployee = false;
                _selectedCompany = null;
              }),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: !_isEmployee ? Theme.of(context).primaryColor : null,
                  borderRadius: const BorderRadius.horizontal(left: Radius.circular(7)),
                ),
                child: Text(
                  'Dueño',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: !_isEmployee ? Colors.white : Colors.grey[600],
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() {
                _isEmployee = true;
                _companyNameController.clear();
              }),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: _isEmployee ? Theme.of(context).primaryColor : null,
                  borderRadius: const BorderRadius.horizontal(right: Radius.circular(7)),
                ),
                child: Text(
                  'Colaborador',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: _isEmployee ? Colors.white : Colors.grey[600],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCompanyDropdown(AsyncValue<List<CompanyModel>> companiesAsync) {
    return companiesAsync.when(
      loading: () => const TextField(
        enabled: false,
        decoration: InputDecoration(
          labelText: 'Empresa',
          prefixIcon: Icon(Icons.business),
          hintText: 'Cargando empresas...',
        ),
      ),
      error: (err, _) => TextField(
        enabled: false,
        decoration: InputDecoration(
          labelText: 'Empresa',
          prefixIcon: Icon(Icons.business),
          hintText: 'Error al cargar empresas',
          errorText: 'Intenta de nuevo',
        ),
      ),
      data: (companies) {
        if (companies.isEmpty) {
          return const TextField(
            enabled: false,
            decoration: InputDecoration(
              labelText: 'Empresa',
              prefixIcon: Icon(Icons.business),
              hintText: 'No hay empresas disponibles',
            ),
          );
        }
        return InputDecorator(
          decoration: const InputDecoration(
            labelText: 'Empresa',
            prefixIcon: Icon(Icons.business),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: _selectedCompany?.id,
              isExpanded: true,
              hint: Text(
                'Selecciona una empresa',
                style: TextStyle(color: Colors.grey[500]),
              ),
              items: companies.map((c) => DropdownMenuItem(
                value: c.id,
                child: Text(c.name),
              )).toList(),
              onChanged: (id) {
                setState(() {
                  _selectedCompany = companies.firstWhere((c) => c.id == id);
                });
              },
            ),
          ),
        );
      },
    );
  }
}
