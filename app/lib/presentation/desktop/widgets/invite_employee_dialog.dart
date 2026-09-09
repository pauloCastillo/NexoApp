import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:nexo_app/core/helpers/invite_link_helper.dart';
import 'package:nexo_app/features/companies/providers/branch_provider.dart';
import 'package:nexo_app/features/invitations/providers/invitation_provider.dart';

class InviteEmployeeDialog extends ConsumerStatefulWidget {
  const InviteEmployeeDialog({super.key});
  @override
  ConsumerState<InviteEmployeeDialog> createState() =>
      _InviteEmployeeDialogState();
}

class _InviteEmployeeDialogState extends ConsumerState<InviteEmployeeDialog> {
  final _form = GlobalKey<FormState>();
  final _username = TextEditingController();
  final _email = TextEditingController();
  final _phone = TextEditingController();
  final _job = TextEditingController();
  final _dept = TextEditingController();
  final _shift = TextEditingController();
  String _role = 'employee';
  String? _branchId;
  bool _saving = false;
  Map<String, dynamic>? _result; // {code, inviteLink, waLink}

  @override
  void dispose() {
    for (final c in [_username, _email, _phone, _job, _dept, _shift]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_form.currentState!.validate()) return;
    setState(() => _saving = true);
    try {
      final repo = ref.read(invitationRepositoryProvider);
      final res = await repo.create({
        'username': _username.text.trim(),
        'email': _email.text.trim().toLowerCase(),
        if (_phone.text.trim().isNotEmpty) 'phone': _phone.text.trim(),
        if (_job.text.trim().isNotEmpty) 'jobTitle': _job.text.trim(),
        'role': _role,
        if (_dept.text.trim().isNotEmpty) 'departmentId': _dept.text.trim(),
        if (_branchId != null) 'branchId': _branchId,
        if (_shift.text.trim().isNotEmpty) 'shiftLabel': _shift.text.trim(),
      });
      setState(() => _result = res);
      ref.invalidate(invitationListProvider);
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    if (_result != null) {
      final code = _result!['code'] as String;
      final link =
          _result!['inviteLink'] as String? ??
          InviteLinkHelper.inviteLink(code);
      return AlertDialog(
        title: const Text('Invitación creada'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: cs.primaryContainer,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    Text(
                      code,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 2,
                        color: cs.onPrimaryContainer,
                        fontFamily: 'monospace',
                      ),
                    ),
                    const SizedBox(width: 12),
                    IconButton(
                      icon: const Icon(Icons.copy_rounded),
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: code));
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Código $code copiado')),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              QrImageView(
                data: InviteLinkHelper.deepLink(code),
                version: QrVersions.auto,
                size: 160,
              ),
              const SizedBox(height: 8),
              Text(
                link,
                style: TextStyle(fontSize: 11, color: cs.onSurfaceVariant),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 8,
                children: [
                  FilledButton.icon(
                    icon: const Icon(Icons.copy_rounded, size: 16),
                    label: const Text('Copiar'),
                    onPressed: () {
                      if (!context.mounted) return;
                      Clipboard.setData(ClipboardData(text: code));
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Código $code copiado')),
                      );
                    },
                  ),
                  OutlinedButton.icon(
                    icon: const Icon(Icons.share, size: 16),
                    label: const Text('WhatsApp'),
                    onPressed: () => InviteLinkHelper.shareWhatsApp(
                      _result!['company']?['name'] ?? 'Nexo',
                      code,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cerrar'),
          ),
          FilledButton(
            onPressed: () {
              setState(() => _result = null);
            },
            child: const Text('Crear otra'),
          ),
        ],
      );
    }

    final branchesAsync = ref.watch(branchesProvider);
    return AlertDialog(
      title: const Text('Invitar colaborador'),
      content: SizedBox(
        width: 520,
        child: Form(
          key: _form,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextFormField(
                  controller: _username,
                  decoration: const InputDecoration(
                    labelText: 'Nombre completo *',
                    prefixIcon: Icon(Icons.person_outline),
                  ),
                  validator: (v) => v == null || v.trim().length < 2
                      ? 'Mín 2 caracteres'
                      : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _email,
                  decoration: const InputDecoration(
                    labelText: 'Email *',
                    prefixIcon: Icon(Icons.email_outlined),
                  ),
                  validator: (v) =>
                      v == null || !v.contains('@') ? 'Email inválido' : null,
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _phone,
                        decoration: const InputDecoration(
                          labelText: 'Celular (opcional)',
                          prefixIcon: Icon(Icons.phone_outlined),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _job,
                        decoration: const InputDecoration(
                          labelText: 'Cargo (opcional)',
                          prefixIcon: Icon(Icons.work_outline),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: _role,
                  decoration: const InputDecoration(labelText: 'Rol'),
                  items: const [
                    DropdownMenuItem(
                      value: 'employee',
                      child: Text('Colaborador'),
                    ),
                    DropdownMenuItem(
                      value: 'supervisor',
                      child: Text('Supervisor'),
                    ),
                    DropdownMenuItem(value: 'admin', child: Text('Admin')),
                    DropdownMenuItem(value: 'hr_manager', child: Text('RRHH')),
                  ],
                  onChanged: (v) => setState(() => _role = v!),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _dept,
                  decoration: const InputDecoration(
                    labelText: 'Departamento ID (opcional)',
                    prefixIcon: Icon(Icons.business_outlined),
                  ),
                ),
                const SizedBox(height: 12),
                branchesAsync.when(
                  data: (branches) => DropdownButtonFormField<String>(
                    initialValue: _branchId,
                    decoration: const InputDecoration(
                      labelText: 'Sucursal (opcional)',
                      prefixIcon: Icon(Icons.store),
                    ),
                    items: [
                      const DropdownMenuItem(
                        value: null,
                        child: Text('— Ninguna —'),
                      ),
                      ...branches.map(
                        (b) => DropdownMenuItem(
                          value: b.id,
                          child: Text('${b.name} (${b.geofenceRadius}m)'),
                        ),
                      ),
                    ],
                    onChanged: (v) => setState(() => _branchId = v),
                  ),
                  loading: () => const LinearProgressIndicator(),
                  error: (e, _) => Text('Error branches: $e'),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _shift,
                  decoration: const InputDecoration(
                    labelText: 'Turno (opcional)',
                    prefixIcon: Icon(Icons.schedule),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: _saving ? null : () => Navigator.pop(context),
          child: const Text('Cancelar'),
        ),
        FilledButton(
          onPressed: _saving ? null : _submit,
          child: _saving
              ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ),
                )
              : const Text('Generar'),
        ),
      ],
    );
  }
}
