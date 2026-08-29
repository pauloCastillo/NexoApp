import 'dart:convert';
import 'dart:math' as math;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
class LocationCache {
  static const _keyPos = 'last_position';
  static const _keyGeofence = 'cached_geofence';
  final _s = const FlutterSecureStorage();
  Future<void> savePosition(double lat, double lng, double acc) async {
    await _s.write(key: _keyPos, value: jsonEncode({'lat': lat, 'lng': lng, 'acc': acc, 'ts': DateTime.now().toIso8601String()}));
  }
  Future<Map<String, dynamic>?> getLastPosition() async {
    final v = await _s.read(key: _keyPos);
    if (v == null) return null;
    final m = jsonDecode(v) as Map<String, dynamic>;
    final ts = DateTime.tryParse(m['ts'] as String);
    if (ts == null || DateTime.now().difference(ts).inHours > 24) return null;
    return m;
  }
  Future<void> saveGeofence(double lat, double lng, double radius) async {
    await _s.write(key: _keyGeofence, value: jsonEncode({'lat': lat, 'lng': lng, 'radius': radius, 'ts': DateTime.now().toIso8601String()}));
  }
  Future<Map<String, dynamic>?> getGeofence() async {
    final v = await _s.read(key: _keyGeofence);
    if (v == null) return null;
    final m = jsonDecode(v) as Map<String, dynamic>;
    final ts = DateTime.tryParse(m['ts'] as String);
    if (ts == null || DateTime.now().difference(ts).inHours > 1) return null;
    return m;
  }
  double haversine(double lat1, double lon1, double lat2, double lon2) {
    const R = 6371000.0;
    final dLat = (lat2 - lat1) * 3.1415926535 / 180;
    final dLon = (lon2 - lon1) * 3.1415926535 / 180;
    final a = math.sin(dLat/2)*math.sin(dLat/2) + math.cos(lat1*3.1415926535/180)*math.cos(lat2*3.1415926535/180)*math.sin(dLon/2)*math.sin(dLon/2);
    return R * 2 * math.asin(math.sqrt(a));
  }
}
