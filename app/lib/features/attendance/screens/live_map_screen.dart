import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
class LiveMapScreen extends StatelessWidget {
  const LiveMapScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return FlutterMap(
      options: const MapOptions(initialCenter: LatLng(-17.78, -63.18), initialZoom: 12),
      children: [
        TileLayer(urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', userAgentPackageName: 'nexo'),
        MarkerLayer(markers: [Marker(point: const LatLng(-17.78, -63.18), child: const Icon(Icons.person_pin_circle, color: Colors.red, size: 36))]),
      ],
    );
  }
}
