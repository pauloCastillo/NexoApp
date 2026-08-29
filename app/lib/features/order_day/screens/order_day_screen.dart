import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/presentation/mobile/widgets/page_shell.dart';

class OrderDayScreen extends ConsumerStatefulWidget {
  const OrderDayScreen({super.key});
  @override
  ConsumerState<OrderDayScreen> createState() => _OrderDayScreenState();
}

class _OrderDayScreenState extends ConsumerState<OrderDayScreen> {
  String? _selectedClient;
  final _descriptionController = TextEditingController();
  final _clients = [
    'TechSolutions', 'DesignLab', 'Constructora ABC', 'Hotel Central', 'Clínica San José',
  ];

  @override
  void dispose() {
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PageShell(
      title: 'Orden del Día',
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('SELECCIONA UN CLIENTE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            decoration: const InputDecoration(border: OutlineInputBorder(), prefixIcon: Icon(Icons.business)),
            hint: const Text('Cliente'),
            initialValue: _selectedClient,
            items: _clients.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
            onChanged: (v) => setState(() => _selectedClient = v),
          ),
          const SizedBox(height: 24),
          const Text('DESCRIPCIÓN DE LA TAREA', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
          const SizedBox(height: 8),
          TextField(
            controller: _descriptionController,
            decoration: const InputDecoration(border: OutlineInputBorder(), hintText: 'Describe la tarea a realizar...'),
            maxLines: 5,
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity, height: 48,
            child: FilledButton.icon(
              style: FilledButton.styleFrom(backgroundColor: const Color(0xFF4F6DFF)),
              icon: const Icon(Icons.send),
              label: const Text('INICIAR ORDEN'),
              onPressed: _selectedClient != null && _descriptionController.text.isNotEmpty ? () {} : null,
            ),
          ),
        ],
      ),
    );
  }
}
