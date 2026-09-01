import 'package:flutter/material.dart';
import 'package:nexo_app/domain/employee/entities/employee_model.dart';

class AddEmployeeDialog extends StatefulWidget {
  final EmployeeModel? employee;

  const AddEmployeeDialog({super.key, this.employee});

  @override
  State<AddEmployeeDialog> createState() => _AddEmployeeDialogState();
}

class _AddEmployeeDialogState extends State<AddEmployeeDialog> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameCtrl;
  late final TextEditingController _emailCtrl;
  late final TextEditingController _phoneCtrl;
  late final TextEditingController _jobCtrl;
  late String _selectedRole;

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(text: widget.employee?.username ?? '');
    _emailCtrl = TextEditingController(text: widget.employee?.email ?? '');
    _phoneCtrl = TextEditingController(text: widget.employee?.phone ?? '');
    _jobCtrl = TextEditingController(text: widget.employee?.jobTitle ?? '');
    _selectedRole = widget.employee?.role ?? 'employee';
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _jobCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final isEdit = widget.employee != null;

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      title: Text(
        isEdit ? 'Editar empleado' : 'Nuevo empleado',
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: cs.onSurface,
        ),
      ),
      content: SizedBox(
        width: 480,
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildField('Nombre completo', _nameCtrl, cs, validator: (v) {
                if (v == null || v.trim().length < 2) return 'Mínimo 2 caracteres';
                return null;
              }),
              const SizedBox(height: 16),
              _buildField('Email', _emailCtrl, cs,
                  keyboardType: TextInputType.emailAddress, validator: (v) {
                if (v == null || !v.contains('@') || !v.contains('.')) return 'Email inválido';
                return null;
              }),
              const SizedBox(height: 16),
              _buildField('Teléfono', _phoneCtrl, cs, keyboardType: TextInputType.phone),
              const SizedBox(height: 16),
              _buildField('Cargo', _jobCtrl, cs),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _selectedRole,
                decoration: const InputDecoration(labelText: 'Rol'),
                items: const [
                  DropdownMenuItem(value: 'employee', child: Text('Colaborador')),
                  DropdownMenuItem(value: 'supervisor', child: Text('Supervisor')),
                  DropdownMenuItem(value: 'admin', child: Text('Administrador')),
                  DropdownMenuItem(value: 'hr_manager', child: Text('Recursos Humanos')),
                ],
                onChanged: (v) {
                  if (v != null) setState(() => _selectedRole = v);
                },
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancelar'),
        ),
        FilledButton(
          onPressed: _submit,
          child: Text(isEdit ? 'Guardar' : 'Agregar'),
        ),
      ],
    );
  }

  Widget _buildField(
    String label,
    TextEditingController ctrl,
    ColorScheme cs, {
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: ctrl,
      keyboardType: keyboardType,
      decoration: InputDecoration(labelText: label),
      validator: validator,
    );
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    final data = <String, dynamic>{
      'username': _nameCtrl.text.trim(),
      'email': _emailCtrl.text.trim(),
      'phone': _phoneCtrl.text.trim().isEmpty ? null : _phoneCtrl.text.trim(),
      'jobTitle': _jobCtrl.text.trim().isEmpty ? null : _jobCtrl.text.trim(),
      'role': _selectedRole,
    };
    Navigator.pop(context, data);
  }
}
