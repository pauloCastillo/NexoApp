import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/core/network/result.dart';
//import 'package:nexo_app/data/models/branch_model.dart';
import 'package:nexo_app/domain/employee/entities/employee_model.dart';
import 'package:nexo_app/features/companies/providers/branch_provider.dart';

class BranchAssignmentDialog extends ConsumerStatefulWidget {
  final EmployeeModel employee;
  const BranchAssignmentDialog({super.key, required this.employee});
  @override
  ConsumerState<BranchAssignmentDialog> createState() =>
      _BranchAssignmentDialogState();
}

class _BranchAssignmentDialogState
    extends ConsumerState<BranchAssignmentDialog> {
  late Set<String> _selected;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _selected = Set<String>.from((widget.employee as dynamic).branches ?? []);
    // also try branchIds field
    if (_selected.isEmpty) {
      final b = (widget.employee as dynamic).branchIds;
      if (b is List) _selected = Set<String>.from(b.map((e) => e.toString()));
    }
  }

  @override
  Widget build(BuildContext context) {
    final branchesAsync = ref.watch(branchesProvider);
    return AlertDialog(
      title: Text('Zonas — ${widget.employee.username}'),
      content: SizedBox(
        width: 420,
        child: branchesAsync.when(
          data: (branches) {
            if (branches.isEmpty) {
              return const Text(
                'No hay sucursales creadas. Crea una en Empresa → Sucursales.',
              );
            }
            return Wrap(
              spacing: 8,
              runSpacing: 8,
              children: branches.map((b) {
                final sel = _selected.contains(b.id);
                return FilterChip(
                  label: Text('${b.name} (${b.geofenceRadius}m)'),
                  selected: sel,
                  onSelected: (v) => setState(() {
                    if (v) {
                      _selected.add(b.id);
                    } else {
                      _selected.remove(b.id);
                    }
                  }),
                  avatar: Icon(
                    Icons.store,
                    size: 16,
                    color: sel ? Theme.of(context).colorScheme.primary : null,
                  ),
                );
              }).toList(),
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => Text('Error: $e'),
        ),
      ),
      actions: [
        TextButton(
          onPressed: _saving ? null : () => Navigator.pop(context),
          child: const Text('Cancelar'),
        ),
        FilledButton(
          onPressed: _saving ? null : _save,
          child: _saving
              ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ),
                )
              : const Text('Guardar'),
        ),
      ],
    );
  }

  Future<void> _save() async {
    if (_selected.length > 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Máximo 10 zonas por empleado')),
      );
      return;
    }
    setState(() => _saving = true);
    try {
      final src = ref.read(branchRemoteSourceProvider);
      final res = await src.assignBranchesResult(
        widget.employee.id,
        _selected.toList(),
      );
      if (res is Err) throw Exception((res as Err).failure.message);
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }
}
