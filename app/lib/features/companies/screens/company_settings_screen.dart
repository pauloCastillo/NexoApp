import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';
import 'package:nexo_app/core/auth/auth_state.dart';
import 'package:nexo_app/core/network/dio_provider.dart';
import 'package:nexo_app/data/models/branch_model.dart';
import 'package:nexo_app/features/companies/providers/branch_provider.dart';

class CompanySettingsScreen extends ConsumerStatefulWidget {
  const CompanySettingsScreen({super.key});
  @override
  ConsumerState<CompanySettingsScreen> createState() =>
      _CompanySettingsScreenState();
}

class _CompanySettingsScreenState extends ConsumerState<CompanySettingsScreen> {
  BranchModel? _editing;
  bool _showMap = false;

  @override
  Widget build(BuildContext context) {
    final branchesAsync = ref.watch(branchesProvider);
    final auth = ref.watch(authStateProvider);
    final canEdit =
        auth?.role == 'business_owner' ||
        auth?.role == 'supervisor' ||
        auth?.role == 'superuser' ||
        auth?.role == 'platform_admin';
    final canView =
        canEdit || auth?.role == 'admin' || auth?.role == 'hr_manager';

    if (!canView) {
      return Scaffold(
        appBar: AppBar(title: const Text('Empresa')),
        body: const Center(child: Text('Acceso denegado')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Empresa & Sucursales'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            tooltip: 'Auditoría',
            onPressed: () async {
              try {
                final dioInst = ref.read(dioProvider);
                final resp = await dioInst.get(
                  '/audit-logs',
                  queryParameters: {'entityType': 'Branch'},
                );
                final logs =
                    resp.data['logs'] as List? ??
                    resp.data['auditLogs'] as List? ??
                    [];
                if (context.mounted) {
                  showDialog(
                    context: context,
                    builder: (_) => AlertDialog(
                      title: const Text('Auditoría — Sucursales'),
                      content: SizedBox(
                        width: 400,
                        height: 300,
                        child: logs.isEmpty
                            ? const Text('Sin registros')
                            : ListView.builder(
                                itemCount: logs.length.clamp(0, 10),
                                itemBuilder: (_, i) {
                                  final l = logs[i];
                                  return ListTile(
                                    dense: true,
                                    title: Text(
                                      l['action'] ?? '',
                                      style: const TextStyle(fontSize: 12),
                                    ),
                                    subtitle: Text(
                                      '${l['metadata']?['reason'] ?? ''} — ${l['createdAt'] ?? ''}',
                                      style: const TextStyle(fontSize: 11),
                                    ),
                                  );
                                },
                              ),
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Cerrar'),
                        ),
                      ],
                    ),
                  );
                }
              } catch (e) {
                if (!context.mounted) return;
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(SnackBar(content: Text('Error auditoría: $e')));
              }
            },
          ),
        ],
      ),
      body: branchesAsync.when(
        data: (branches) => _showMap
            ? _BranchMapForm(
                branch: _editing,
                onClose: (saved) {
                  setState(() {
                    _showMap = false;
                    _editing = null;
                  });
                  if (saved) ref.invalidate(branchesProvider);
                },
              )
            : _BranchList(
                branches: branches,
                canEdit: canEdit,
                onAdd: () => setState(() {
                  _editing = null;
                  _showMap = true;
                }),
                onEdit: (b) => setState(() {
                  _editing = b;
                  _showMap = true;
                }),
              ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _BranchList extends ConsumerWidget {
  final List<BranchModel> branches;
  final bool canEdit;
  final VoidCallback onAdd;
  final void Function(BranchModel) onEdit;
  const _BranchList({
    required this.branches,
    required this.canEdit,
    required this.onAdd,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      children: [
        if (canEdit)
          Padding(
            padding: const EdgeInsets.all(12),
            child: SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                icon: const Icon(Icons.add),
                label: const Text('Nueva sucursal'),
                onPressed: onAdd,
              ),
            ),
          ),
        Expanded(
          child: branches.isEmpty
              ? const Center(child: Text('Sin sucursales. Crea la primera.'))
              : ListView.separated(
                  padding: const EdgeInsets.all(12),
                  itemCount: branches.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 8),
                  itemBuilder: (_, i) {
                    final b = branches[i];
                    return Card(
                      child: ListTile(
                        leading: const CircleAvatar(
                          child: Icon(Icons.store, size: 20),
                        ),
                        title: Text(
                          b.name,
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        subtitle: Text(
                          '${b.address ?? '${b.lat.toStringAsFixed(5)}, ${b.lng.toStringAsFixed(5)}'}\nRadio: ${b.geofenceRadius}m',
                        ),
                        isThreeLine: true,
                        trailing: canEdit
                            ? Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.edit),
                                    onPressed: () => onEdit(b),
                                  ),
                                  IconButton(
                                    icon: const Icon(
                                      Icons.delete_outline,
                                      color: Colors.red,
                                    ),
                                    onPressed: () async {
                                      final ok = await showDialog<bool>(
                                        context: context,
                                        builder: (_) => AlertDialog(
                                          title: const Text(
                                            'Desactivar sucursal',
                                          ),
                                          content: Text(
                                            '¿Desactivar ${b.name}?',
                                          ),
                                          actions: [
                                            TextButton(
                                              onPressed: () =>
                                                  Navigator.pop(context, false),
                                              child: const Text('Cancelar'),
                                            ),
                                            FilledButton(
                                              onPressed: () =>
                                                  Navigator.pop(context, true),
                                              child: const Text('Desactivar'),
                                            ),
                                          ],
                                        ),
                                      );
                                      if (ok == true) {
                                        try {
                                          await ref
                                              .read(branchRepositoryProvider)
                                              .deleteBranch(b.id);
                                          ref.invalidate(branchesProvider);
                                          if (!context.mounted) return;
                                          ScaffoldMessenger.of(
                                            context,
                                          ).showSnackBar(
                                            const SnackBar(
                                              content: Text(
                                                'Sucursal desactivada',
                                              ),
                                            ),
                                          );
                                        } catch (e) {
                                          if (!context.mounted) return;
                                          ScaffoldMessenger.of(
                                            context,
                                          ).showSnackBar(
                                            SnackBar(
                                              content: Text('Error: $e'),
                                            ),
                                          );
                                        }
                                      }
                                    },
                                  ),
                                ],
                              )
                            : null,
                        onTap: canEdit ? () => onEdit(b) : null,
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}

class _BranchMapForm extends ConsumerStatefulWidget {
  final BranchModel? branch;
  final void Function(bool saved) onClose;
  const _BranchMapForm({this.branch, required this.onClose});
  @override
  ConsumerState<_BranchMapForm> createState() => _BranchMapFormState();
}

class _BranchMapFormState extends ConsumerState<_BranchMapForm> {
  final _nameCtrl = TextEditingController();
  final _searchCtrl = TextEditingController();
  final _reasonCtrl = TextEditingController();
  final _mapController = MapController();
  LatLng? _center;
  LatLng? _initialCenter;
  double _radius = 200;
  double _initialRadius = 200;
  String? _address;
  bool _saving = false;
  bool _locating = false;
  bool _locatingInitial = false;
  bool _showMyLocation = true;
  bool _mapReady = false;
  LatLng? _pendingMove;
  List<Map<String, dynamic>> _searchResults = [];
  Timer? _debounce;

  static const _fallbackSCZ = LatLng(-17.78, -63.18);

  @override
  void initState() {
    super.initState();
    if (widget.branch != null) {
      _nameCtrl.text = widget.branch!.name;
      _address = widget.branch!.address;
      _center = LatLng(widget.branch!.lat, widget.branch!.lng);
      _initialCenter = _center;
      _radius = widget.branch!.geofenceRadius.toDouble();
      _initialRadius = _radius;
    } else {
      _center = _fallbackSCZ;
    }
    WidgetsBinding.instance.addPostFrameCallback((_) => _initGeolocation());
  }

  Future<void> _initGeolocation() async {
    // 1) detect support — geolocator throws UnsupportedError on desktop without backend
    try {
      await Geolocator.isLocationServiceEnabled();
    } catch (_) {
      if (mounted) setState(() => _showMyLocation = false);
      return;
    }
    if (!mounted) return;
    setState(() => _showMyLocation = true);
    // editing → keep its location, don't auto-move
    if (widget.branch != null) return;
    setState(() => _locatingInitial = true);
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return;
      var perm = await Geolocator.checkPermission();
      if (perm == LocationPermission.denied) {
        perm = await Geolocator.requestPermission();
      }
      if (perm == LocationPermission.denied ||
          perm == LocationPermission.deniedForever) {
        return;
      }
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 8),
        ),
      );
      final ll = LatLng(pos.latitude, pos.longitude);
      final addr = await ref
          .read(geocodingServiceProvider)
          .reverse(pos.latitude, pos.longitude);
      if (!mounted) return;
      setState(() {
        _center = ll;
        _address = addr ?? _address;
      });
      _moveCamera(ll);
    } catch (_) {
      // keep fallback SCZ
    } finally {
      if (mounted) setState(() => _locatingInitial = false);
    }
  }

  void _moveCamera(LatLng ll) {
    if (_mapReady) {
      try {
        _mapController.move(ll, 15);
      } catch (_) {}
    } else {
      _pendingMove = ll;
    }
  }

  Future<void> _placePin(LatLng ll) async {
    String? addr;
    try {
      addr = await ref
          .read(geocodingServiceProvider)
          .reverse(ll.latitude, ll.longitude);
    } catch (_) {}
    if (!mounted) return;
    setState(() {
      _center = ll;
      if (addr != null) _address = addr;
    });
    _moveCamera(ll);
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _searchCtrl.dispose();
    _reasonCtrl.dispose();
    _debounce?.cancel();
    _mapController.dispose();
    super.dispose();
  }

  Future<void> _useMyLocation() async {
    if (_locating) return;
    setState(() => _locating = true);
    try {
      bool serviceEnabled = false;
      try {
        serviceEnabled = await Geolocator.isLocationServiceEnabled();
      } catch (_) {
        if (mounted) setState(() => _showMyLocation = false);
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Geolocalización no soportada en este equipo'),
          ),
        );
        return;
      }
      if (!serviceEnabled) {
        if (!mounted) return;
        final open = await showDialog<bool>(
          context: context,
          builder: (_) => AlertDialog(
            title: const Text('GPS desactivado'),
            content: const Text('Activa el GPS para usar tu ubicación.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Cancelar'),
              ),
              FilledButton(
                onPressed: () => Navigator.pop(context, true),
                child: const Text('Abrir ajustes'),
              ),
            ],
          ),
        );
        if (open == true) await Geolocator.openLocationSettings();
        return;
      }
      var perm = await Geolocator.checkPermission();
      if (perm == LocationPermission.denied) {
        perm = await Geolocator.requestPermission();
        if (perm == LocationPermission.denied) {
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Permiso de ubicación denegado')),
          );
          return;
        }
      }
      if (perm == LocationPermission.deniedForever) {
        if (!mounted) return;
        final open = await showDialog<bool>(
          context: context,
          builder: (_) => AlertDialog(
            title: const Text('Permiso denegado'),
            content: const Text(
              'El permiso está bloqueado. Ábrelo en ajustes.',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Cancelar'),
              ),
              FilledButton(
                onPressed: () => Navigator.pop(context, true),
                child: const Text('Abrir ajustes'),
              ),
            ],
          ),
        );
        if (open == true) await Geolocator.openAppSettings();
        return;
      }
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 8),
        ),
      );
      await _placePin(LatLng(pos.latitude, pos.longitude));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('GPS error: $e')));
    } finally {
      if (mounted) setState(() => _locating = false);
    }
  }

  void _onSearchChanged(String v) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () async {
      if (v.trim().length < 3) {
        if (mounted) setState(() => _searchResults = []);
        return;
      }
      try {
        final res = await ref.read(geocodingServiceProvider).search(v);
        if (mounted) setState(() => _searchResults = res);
      } catch (_) {
        if (mounted) setState(() => _searchResults = []);
      }
    });
  }

  void _selectSearch(Map<String, dynamic> r) {
    final lat = double.tryParse(r['lat'].toString());
    final lon = double.tryParse(r['lon'].toString());
    if (lat == null || lon == null) return;
    final ll = LatLng(lat, lon);
    setState(() {
      _searchResults = [];
      _searchCtrl.text = r['display_name'] ?? '';
      _address = r['display_name'] as String?;
    });
    _placePin(ll);
  }

  bool get _isDirty {
    if (widget.branch == null) return true;
    if (_initialCenter == null || _center == null) return true;
    return _initialCenter!.latitude != _center!.latitude ||
        _initialCenter!.longitude != _center!.longitude ||
        _initialRadius != _radius;
  }

  Future<void> _save() async {
    if (_nameCtrl.text.trim().isEmpty || _center == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nombre y ubicación requeridos')),
      );
      return;
    }
    if (widget.branch != null && _isDirty && _reasonCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Motivo requerido al mover geocerca')),
      );
      return;
    }
    if (_isDirty && widget.branch != null) {
      final ok = await showDialog<bool>(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('Confirmar movimiento'),
          content: Text(
            'Moverás la geocerca de ${widget.branch!.name}. ¿Continuar?',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancelar'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Confirmar'),
            ),
          ],
        ),
      );
      if (ok != true) return;
    }
    setState(() => _saving = true);
    try {
      final body = {
        'name': _nameCtrl.text.trim(),
        'location': {'lat': _center!.latitude, 'lng': _center!.longitude},
        'geofenceRadius': _radius.round(),
        if (_address != null) 'address': _address,
        if (_reasonCtrl.text.trim().isNotEmpty)
          'reason': _reasonCtrl.text.trim(),
      };
      if (widget.branch == null) {
        await ref.read(branchRepositoryProvider).createBranch(body);
      } else {
        await ref
            .read(branchRepositoryProvider)
            .updateBranch(widget.branch!.id, body);
      }
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Sucursal guardada')));
      widget.onClose(true);
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
    // ponytail: Stack B — mapa fullscreen + paneles flotantes
    return Stack(
      children: [
        // Mapa fullscreen
        Positioned.fill(
          child: FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: _center!,
              initialZoom: 15,
              interactionOptions: const InteractionOptions(
                flags: InteractiveFlag.all & ~InteractiveFlag.doubleTapZoom,
              ),
              onMapReady: () {
                _mapReady = true;
                if (_pendingMove != null) {
                  try {
                    _mapController.move(_pendingMove!, 15);
                  } catch (_) {}
                  _pendingMove = null;
                }
              },
              onTap: (_, latlng) => _placePin(latlng),
              // ponytail: onDoubleTap no existe en flutter_map 8 — con doubleTapZoom deshabilitado, doble click dispara onTap (mismo efecto)
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'nexo_desktop',
              ),
              CircleLayer(
                circles: [
                  CircleMarker(
                    point: _center!,
                    radius: _radius,
                    color: cs.primary.withValues(alpha: 0.15),
                    borderColor: cs.primary,
                    borderStrokeWidth: 2,
                  ),
                ],
              ),
              MarkerLayer(
                markers: [
                  Marker(
                    point: _center!,
                    width: 40,
                    height: 40,
                    child: Icon(Icons.location_on, color: cs.error, size: 40),
                  ),
                ],
              ),
            ],
          ),
        ),
        if (_locatingInitial)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: SafeArea(
              child: Center(
                child: Container(
                  margin: const EdgeInsets.only(top: 8),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: cs.surface,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.15),
                        blurRadius: 6,
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                      SizedBox(width: 8),
                      Text('Ubicándote...', style: TextStyle(fontSize: 12)),
                    ],
                  ),
                ),
              ),
            ),
          ),
        // Panel superior flotante
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          child: SafeArea(
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                12,
                _locatingInitial ? 44 : 8,
                12,
                0,
              ),
              child: Material(
                elevation: 4,
                borderRadius: BorderRadius.circular(12),
                color: cs.surface,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      TextField(
                        controller: _nameCtrl,
                        decoration: const InputDecoration(
                          labelText: 'Nombre sucursal *',
                          prefixIcon: Icon(Icons.store),
                          isDense: true,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _searchCtrl,
                        decoration: InputDecoration(
                          labelText: 'Buscar dirección',
                          prefixIcon: const Icon(Icons.search),
                          isDense: true,
                          suffixIcon: _showMyLocation
                              ? (_locating
                                    ? const Padding(
                                        padding: EdgeInsets.all(12),
                                        child: SizedBox(
                                          width: 16,
                                          height: 16,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                          ),
                                        ),
                                      )
                                    : IconButton(
                                        icon: const Icon(Icons.my_location),
                                        tooltip: 'Mi ubicación',
                                        onPressed: _useMyLocation,
                                      ))
                              : null,
                        ),
                        onChanged: _onSearchChanged,
                      ),
                      if (_searchResults.isNotEmpty)
                        Container(
                          constraints: const BoxConstraints(maxHeight: 140),
                          margin: const EdgeInsets.only(top: 8),
                          decoration: BoxDecoration(
                            color: cs.surface,
                            border: Border.all(color: cs.outlineVariant),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: ListView.builder(
                            shrinkWrap: true,
                            itemCount: _searchResults.length,
                            itemBuilder: (_, i) => ListTile(
                              dense: true,
                              title: Text(
                                _searchResults[i]['display_name'] ?? '',
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12),
                              ),
                              onTap: () => _selectSearch(_searchResults[i]),
                            ),
                          ),
                        ),
                      if (_address != null)
                        Padding(
                          padding: const EdgeInsets.only(top: 6),
                          child: Text(
                            _address!,
                            style: TextStyle(
                              fontSize: 11,
                              color: cs.onSurfaceVariant,
                            ),
                          ),
                        ),
                      if (widget.branch != null && _isDirty)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: TextField(
                            controller: _reasonCtrl,
                            decoration: const InputDecoration(
                              labelText: 'Motivo del cambio *',
                              prefixIcon: Icon(Icons.comment),
                              isDense: true,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
        // Panel inferior flotante
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Material(
                elevation: 6,
                borderRadius: BorderRadius.circular(16),
                color: cs.surface,
                child: Container(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            'Radio: ${_radius.round()}m',
                            style: const TextStyle(fontWeight: FontWeight.w600),
                          ),
                          const Spacer(),
                          TextButton(
                            onPressed: () => widget.onClose(false),
                            child: const Text('Cancelar'),
                          ),
                        ],
                      ),
                      Slider(
                        value: _radius,
                        min: 50,
                        max: 2000,
                        divisions: 39,
                        label: '${_radius.round()}m',
                        onChanged: (v) => setState(() => _radius = v),
                      ),
                      SizedBox(
                        width: double.infinity,
                        height: 44,
                        child: FilledButton.icon(
                          onPressed: _saving ? null : _save,
                          icon: _saving
                              ? const SizedBox(
                                  width: 18,
                                  height: 18,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Icon(Icons.save),
                          label: Text(
                            _saving
                                ? 'Guardando...'
                                : widget.branch == null
                                ? 'Crear sucursal'
                                : 'Guardar cambios',
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
