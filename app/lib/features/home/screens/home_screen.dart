import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import 'package:nexo_app/core/auth/auth_state.dart';
import 'package:nexo_app/core/network/dio_provider.dart';
import 'package:nexo_app/core/storage/location_cache.dart';
import 'package:nexo_app/core/storage/pending_queue.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final now = DateTime.now();
    final time = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
    final date = '${now.day}/${now.month}/${now.year}';

    return ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Text(time, style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(date, style: TextStyle(color: Colors.grey[600])),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: FilledButton.icon(
                          style: FilledButton.styleFrom(backgroundColor: const Color(0xFF4CAF50)),
                          icon: const Icon(Icons.login),
                          label: const Text('Entrada'),
                          onPressed: () => _register(ref, context, 'entrada'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: const Icon(Icons.logout, color: Colors.red),
                          label: const Text('Salida', style: TextStyle(color: Colors.red)),
                          onPressed: () => _register(ref, context, 'salida'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: const Icon(Icons.free_breakfast),
                          label: const Text('Descanso'),
                          onPressed: () => _register(ref, context, 'descanso'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: const Icon(Icons.restore),
                          label: const Text('Retorno'),
                          onPressed: () => _register(ref, context, 'retorno'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          _card(context, Icons.assignment, 'Orden del Día', 'Gestiona tus tareas diarias', '/order-day'),
          _card(context, Icons.history, 'Historial', 'Revisa tus marcajes anteriores', '/history'),
          _card(context, Icons.work, 'Órdenes de Trabajo', 'Trabajos pendientes y completados', '/work-orders'),
          _card(context, Icons.beach_access, 'Mis Solicitudes', 'Vacaciones y Licencias', '/my-requests'),
        ],
      );
  }

  Future<void> _register(WidgetRef ref, BuildContext context, String label) async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      if (context.mounted) _showError(context, 'Activa el GPS para registrar');
      return;
    }
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return;
    }
    if (permission == LocationPermission.deniedForever) {
      if (context.mounted) _showError(context, 'Permiso de ubicación denegado permanentemente');
      return;
    }

    final cache = LocationCache();
    final queue = PendingQueue();
    Position? pos;
    bool isCached = false;
    try {
      pos = await Geolocator.getCurrentPosition(locationSettings: const LocationSettings(accuracy: LocationAccuracy.high, timeLimit: Duration(seconds: 5)));
      await cache.savePosition(pos.latitude, pos.longitude, pos.accuracy);
    } catch (_) {
      final cached = await cache.getLastPosition();
      if (cached != null) {
        pos = Position(longitude: cached['lng'], latitude: cached['lat'], timestamp: DateTime.now(), accuracy: cached['acc'], altitude: 0, altitudeAccuracy: 0, heading: 0, headingAccuracy: 0, speed: 0, speedAccuracy: 0);
        isCached = true;
      } else {
        if (context.mounted) _showError(context, 'Sin GPS ni cache disponible');
        return;
      }
    }
    final dio = ref.read(dioProvider);
    final auth = ref.read(authStateProvider);
    final payload = {
      'locationTimeData': {
        'employee': auth!.userId,
        'date': DateTime.now().toIso8601String(),
        'label': label,
        'location': {'latitude': pos.latitude, 'longitude': pos.longitude},
        'isCachedPosition': isCached,
      },
    };
    try {
      final resp = await dio.post('/locations', data: payload);
      final warning = resp.data?['warning'] as String?;
      if (context.mounted) {
        if (warning != null) {
          final isSupervisor = auth?.role == 'supervisor' || auth?.role == 'business_owner';
          if (isSupervisor) {
            final override = await showDialog<bool>(context: context, builder: (_) => AlertDialog(title: const Text('Fuera de zona'), content: Text(warning), actions: [TextButton(onPressed: ()=> Navigator.pop(context,false), child: const Text('Aceptar warning')), FilledButton(onPressed: ()=> Navigator.pop(context,true), child: const Text('Override supervisor'))]));
            if (override == true) {
              final reasonCtrl = TextEditingController();
              final reason = await showDialog<String>(context: context, builder: (_) => AlertDialog(title: const Text('Motivo override'), content: TextField(controller: reasonCtrl, decoration: const InputDecoration(hintText:'Motivo')), actions: [TextButton(onPressed: ()=> Navigator.pop(context), child: const Text('Cancelar')), FilledButton(onPressed: ()=> Navigator.pop(context, reasonCtrl.text), child: const Text('Confirmar'))]));
              if (reason!=null && reason.trim().isNotEmpty) {
                (payload['locationTimeData'] as Map<String,dynamic>)['override']=true;
                (payload['locationTimeData'] as Map<String,dynamic>)['overrideReason']=reason.trim();
                await dio.post('/locations', data: payload);
                if(context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Registro con override exitoso')));
                return;
              }
            }
          }
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(warning), backgroundColor: Colors.orange[800]));
        } else {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(isCached ? '$label registrada (cache)' : '$label registrada')));
        }
      }
    } on DioException catch (e) {
      // offline → queue
      if (e.type == DioExceptionType.connectionError || e.response == null) {
        await queue.enqueue(payload);
        if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Registrado offline, se sincronizará')));
        return;
      }
      final msg = e.response?.data?['message'] as String? ?? 'Error al registrar';
      if (context.mounted) _showError(context, msg);
    }
  }

  void _showError(BuildContext context, String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(msg),
      backgroundColor: Colors.red[700],
    ));
  }

  Widget _card(BuildContext context, IconData icon, String title, String subtitle, String route) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(child: Icon(icon)),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: () => context.go(route),
      ),
    );
  }
}
