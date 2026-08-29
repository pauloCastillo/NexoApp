import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexo_app/features/work_orders/providers/work_order_provider.dart';

class WorkOrderListScreen extends ConsumerWidget {
  const WorkOrderListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(workOrderListProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Órdenes de trabajo')),
      body: ordersAsync.when(
        data: (orders) => ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: orders.length,
          itemBuilder: (_, i) => Card(
            child: ListTile(
              leading: const CircleAvatar(child: Icon(Icons.assignment)),
              title: Text(orders[i].clientName),
              subtitle: Text(orders[i].description),
              trailing: Chip(label: Text(orders[i].status)),
            ),
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {},
      ),
    );
  }
}