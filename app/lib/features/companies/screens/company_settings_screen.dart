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
  ConsumerState<CompanySettingsScreen> createState() => _CompanySettingsScreenState();
}

class _CompanySettingsScreenState extends ConsumerState<CompanySettingsScreen> {
  BranchModel? _editing;
  bool _showMap = false;

  @override
  Widget build(BuildContext context) {
    final branchesAsync = ref.watch(branchesProvider);
    final auth = ref.watch(authStateProvider);
    final canEdit = auth?.role == 'business_owner' || auth?.role == 'supervisor' || auth?.role == 'superuser' || auth?.role == 'platform_admin';
    final canView = canEdit || auth?.role == 'admin' || auth?.role == 'hr_manager';

    if (!canView) return Scaffold(appBar: AppBar(title: const Text('Empresa')), body: const Center(child: Text('Acceso denegado')));

    return Scaffold(
      appBar: AppBar(title: const Text('Empresa & Sucursales'), actions: [
        IconButton(icon: const Icon(Icons.history), tooltip: 'Auditoría', onPressed: () async {
          try {
            final dioInst = ref.read(dioProvider);
            final resp = await dioInst.get('/audit-logs', queryParameters: {'entityType': 'Branch'});
            final logs = resp.data['logs'] as List? ?? resp.data['auditLogs'] as List? ?? [];
            if (context.mounted) showDialog(context: context, builder: (_) => AlertDialog(title: const Text('Auditoría — Sucursales'), content: SizedBox(width: 400, height: 300, child: logs.isEmpty ? const Text('Sin registros') : ListView.builder(itemCount: logs.length.clamp(0,10), itemBuilder: (_,i){ final l=logs[i]; return ListTile(dense:true, title: Text(l['action']??'', style: const TextStyle(fontSize:12)), subtitle: Text('${l['metadata']?['reason']??''} — ${l['createdAt']??''}', style: const TextStyle(fontSize:11))); })), actions: [TextButton(onPressed: ()=> Navigator.pop(context), child: const Text('Cerrar'))]));
          } catch (e) { if(context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error auditoría: $e'))); }
        }),
      ]),
      body: branchesAsync.when(
        data: (branches) => _showMap
            ? _BranchMapForm(branch: _editing, onClose: (saved) { setState(() {_showMap=false; _editing=null;}); if(saved) ref.invalidate(branchesProvider); })
            : _BranchList(branches: branches, canEdit: canEdit, onAdd: () => setState(() {_editing=null; _showMap=true;}), onEdit: (b) => setState(() {_editing=b; _showMap=true;})),
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
  const _BranchList({required this.branches, required this.canEdit, required this.onAdd, required this.onEdit});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(children: [
      if (canEdit) Padding(padding: const EdgeInsets.all(12), child: SizedBox(width: double.infinity, child: FilledButton.icon(icon: const Icon(Icons.add), label: const Text('Nueva sucursal'), onPressed: onAdd))),
      Expanded(child: branches.isEmpty
          ? const Center(child: Text('Sin sucursales. Crea la primera.'))
          : ListView.separated(
              padding: const EdgeInsets.all(12),
              itemCount: branches.length,
              separatorBuilder: (_,__)=> const SizedBox(height:8),
              itemBuilder: (_,i){
                final b = branches[i];
                return Card(child: ListTile(
                  leading: const CircleAvatar(child: Icon(Icons.store, size: 20)),
                  title: Text(b.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                  subtitle: Text('${b.address ?? '${b.lat.toStringAsFixed(5)}, ${b.lng.toStringAsFixed(5)}'}\nRadio: ${b.geofenceRadius}m'),
                  isThreeLine: true,
                  trailing: canEdit ? Row(mainAxisSize: MainAxisSize.min, children: [
                    IconButton(icon: const Icon(Icons.edit), onPressed: ()=> onEdit(b)),
                    IconButton(icon: const Icon(Icons.delete_outline, color: Colors.red), onPressed: () async {
                      final ok = await showDialog<bool>(context: context, builder: (_) => AlertDialog(title: const Text('Desactivar sucursal'), content: Text('¿Desactivar ${b.name}?'), actions: [TextButton(onPressed: ()=> Navigator.pop(context,false), child: const Text('Cancelar')), FilledButton(onPressed: ()=> Navigator.pop(context,true), child: const Text('Desactivar'))]));
                      if (ok == true) {
                        try { await ref.read(branchRepositoryProvider).deleteBranch(b.id); ref.invalidate(branchesProvider); if(context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Sucursal desactivada')));} catch(e){ if(context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'))); }
                      }
                    }),
                  ]) : null,
                  onTap: canEdit ? ()=> onEdit(b) : null,
                ));
              })),
    ]);
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
  LatLng? _center;
  LatLng? _initialCenter;
  double _radius = 200;
  double _initialRadius = 200;
  String? _address;
  bool _saving = false;
  List<Map<String,dynamic>> _searchResults = [];
  Timer? _debounce;

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
      _center = const LatLng(19.4326, -99.1332);
    }
  }

  @override
  void dispose() { _nameCtrl.dispose(); _searchCtrl.dispose(); _reasonCtrl.dispose(); _debounce?.cancel(); super.dispose(); }

  Future<void> _useMyLocation() async {
    try {
      final perm = await Geolocator.checkPermission();
      if (perm == LocationPermission.denied) await Geolocator.requestPermission();
      final pos = await Geolocator.getCurrentPosition(locationSettings: const LocationSettings(accuracy: LocationAccuracy.high, timeLimit: Duration(seconds: 5)));
      final latlng = LatLng(pos.latitude, pos.longitude);
      final addr = await ref.read(geocodingServiceProvider).reverse(pos.latitude, pos.longitude);
      setState(() {_center = latlng; _address = addr;});
    } catch (e) {
      if(mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('GPS error: $e')));
    }
  }

  void _onSearchChanged(String v) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () async {
      if(v.trim().length < 3) { setState(()=>_searchResults=[]); return; }
      final res = await ref.read(geocodingServiceProvider).search(v);
      if(mounted) setState(()=>_searchResults=res);
    });
  }

  void _selectSearch(Map<String,dynamic> r) {
    final lat = double.parse(r['lat']); final lon = double.parse(r['lon']);
    setState(() {_center=LatLng(lat,lon); _address=r['display_name'] as String?; _searchResults=[]; _searchCtrl.text=r['display_name'] ?? '';});
  }

  bool get _isDirty {
    if (widget.branch == null) return true;
    if (_initialCenter == null || _center == null) return true;
    return _initialCenter!.latitude != _center!.latitude || _initialCenter!.longitude != _center!.longitude || _initialRadius != _radius;
  }

  Future<void> _save() async {
    if(_nameCtrl.text.trim().isEmpty || _center==null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Nombre y ubicación requeridos')));
      return;
    }
    if(widget.branch != null && _isDirty && _reasonCtrl.text.trim().isEmpty){
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Motivo requerido al mover geocerca')));
      return;
    }
    if(_isDirty && widget.branch != null){
      final ok = await showDialog<bool>(context: context, builder: (_)=> AlertDialog(title: const Text('Confirmar movimiento'), content: Text('Moverás la geocerca de ${widget.branch!.name}. ¿Continuar?'), actions: [TextButton(onPressed: ()=> Navigator.pop(context,false), child: const Text('Cancelar')), FilledButton(onPressed: ()=> Navigator.pop(context,true), child: const Text('Confirmar'))]));
      if(ok != true) return;
    }
    setState(()=>_saving=true);
    try{
      final body = {'name': _nameCtrl.text.trim(), 'location': {'lat': _center!.latitude, 'lng': _center!.longitude}, 'geofenceRadius': _radius.round(), if(_address!=null) 'address': _address, if(_reasonCtrl.text.trim().isNotEmpty) 'reason': _reasonCtrl.text.trim()};
      if(widget.branch==null) await ref.read(branchRepositoryProvider).createBranch(body);
      else await ref.read(branchRepositoryProvider).updateBranch(widget.branch!.id, body);
      if(mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Sucursal guardada')));
      widget.onClose(true);
    } catch(e){
      if(mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally { if(mounted) setState(()=>_saving=false); }
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Column(children: [
      Padding(padding: const EdgeInsets.fromLTRB(12,8,12,8), child: Column(children: [
        TextField(controller: _nameCtrl, decoration: const InputDecoration(labelText: 'Nombre sucursal *', prefixIcon: Icon(Icons.store))), 
        const SizedBox(height:8),
        TextField(controller: _searchCtrl, decoration: InputDecoration(labelText: 'Buscar dirección', prefixIcon: const Icon(Icons.search), suffixIcon: IconButton(icon: const Icon(Icons.my_location), onPressed: _useMyLocation)), onChanged: _onSearchChanged),
        if(_searchResults.isNotEmpty) Container(constraints: const BoxConstraints(maxHeight: 140), decoration: BoxDecoration(color: cs.surface, border: Border.all(color: cs.outlineVariant)), child: ListView.builder(shrinkWrap:true, itemCount:_searchResults.length, itemBuilder: (_,i)=> ListTile(dense:true, title: Text(_searchResults[i]['display_name'], maxLines:2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize:12)), onTap: ()=> _selectSearch(_searchResults[i])))),
        if(_address!=null) Padding(padding: const EdgeInsets.only(top:4), child: Text(_address!, style: TextStyle(fontSize:12, color: cs.onSurfaceVariant))),
        if(widget.branch!=null && _isDirty) TextField(controller: _reasonCtrl, decoration: const InputDecoration(labelText: 'Motivo del cambio *', prefixIcon: Icon(Icons.comment))),
      ])),
      Expanded(child: FlutterMap(
        options: MapOptions(initialCenter: _center!, initialZoom: 15, onTap: (_,latlng) async { final addr = await ref.read(geocodingServiceProvider).reverse(latlng.latitude, latlng.longitude); setState(() {_center=latlng; _address=addr;}); }),
        children: [
          TileLayer(urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', userAgentPackageName: 'nexo_desktop'),
          CircleLayer(circles: [CircleMarker(point: _center!, radius: _radius, color: cs.primary.withValues(alpha:0.15), borderColor: cs.primary, borderStrokeWidth: 2)]),
          MarkerLayer(markers: [Marker(point: _center!, width: 40, height: 40, child: Icon(Icons.location_on, color: cs.error, size: 40))]),
        ],
      )),
      Container(padding: const EdgeInsets.fromLTRB(16,8,16,16), decoration: BoxDecoration(color: cs.surface, boxShadow: [BoxShadow(color: Colors.black.withValues(alpha:0.08), blurRadius:8)]), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children:[Text('Radio: ${_radius.round()}m', style: const TextStyle(fontWeight: FontWeight.w600)), const Spacer(), TextButton(onPressed: ()=> widget.onClose(false), child: const Text('Cancelar'))]),
        Slider(value: _radius, min: 50, max: 2000, divisions: 39, label: '${_radius.round()}m', onChanged: (v)=> setState(()=>_radius=v)),
        SizedBox(width: double.infinity, height:44, child: FilledButton.icon(onPressed: _saving?null:_save, icon: _saving? const SizedBox(width:18,height:18,child: CircularProgressIndicator(strokeWidth:2,color:Colors.white)): const Icon(Icons.save), label: Text(_saving?'Guardando…': widget.branch==null?'Crear sucursal':'Guardar cambios'))),
      ])),
    ]);
  }
}
