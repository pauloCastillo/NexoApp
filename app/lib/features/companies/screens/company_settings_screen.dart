import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';
import 'package:nexo_app/data/models/company_model.dart';
import 'package:nexo_app/features/companies/providers/company_provider.dart';

class CompanySettingsScreen extends ConsumerStatefulWidget {
  const CompanySettingsScreen({super.key});

  @override
  ConsumerState<CompanySettingsScreen> createState() => _CompanySettingsScreenState();
}

class _CompanySettingsScreenState extends ConsumerState<CompanySettingsScreen> {
  LatLng? _center;
  double _radius = 200;
  bool _saving = false;

  @override
  Widget build(BuildContext context) {
    final companyAsync = ref.watch(companyProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Configuración de empresa')),
      body: companyAsync.when(
        data: (company) => _buildForm(company),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }

  Widget _buildForm(CompanyModel company) {
    _center ??= company.locationLat != null
        ? LatLng(company.locationLat!, company.locationLng!)
        : const LatLng(19.4326, -99.1332);
    _radius = (company.geofenceRadius ?? 200).toDouble();
    final cs = Theme.of(context).colorScheme;

    return Column(
      children: [
        Expanded(
          child: FlutterMap(
            options: MapOptions(
              initialCenter: _center!,
              initialZoom: 15,
              onTap: (tapPos, latlng) => setState(() => _center = latlng),
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'nexo_desktop',
              ),
              if (_center != null) ...[
                CircleLayer(circles: [
                  CircleMarker(
                    point: _center!,
                    radius: _radius,
                    color: cs.primary.withValues(alpha: 0.15),
                    borderColor: cs.primary,
                    borderStrokeWidth: 2,
                  ),
                ]),
                MarkerLayer(markers: [
                  Marker(
                    point: _center!,
                    child: Icon(Icons.location_on, color: cs.error, size: 40),
                  ),
                ]),
              ],
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
          decoration: BoxDecoration(
            color: cs.surface,
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 8)],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Radio de geocerca: ${_radius.round()}m',
                style: TextStyle(fontWeight: FontWeight.w600, color: cs.onSurface)),
              Slider(
                value: _radius,
                min: 50,
                max: 2000,
                divisions: 39,
                label: '${_radius.round()}m',
                onChanged: (v) => setState(() => _radius = v),
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                height: 44,
                child: FilledButton.icon(
                  onPressed: _saving ? null : _save,
                  icon: _saving ? const SizedBox(
                    width: 18, height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  ) : const Icon(Icons.save_rounded),
                  label: Text(_saving ? 'Guardando…' : 'Guardar ubicación'),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      await ref.read(companyRepositoryProvider).updateCompany({
        'location': {'lat': _center!.latitude, 'lng': _center!.longitude},
        'geofenceRadius': _radius.round(),
      });
      ref.invalidate(companyProvider);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Ubicación guardada')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }
}
