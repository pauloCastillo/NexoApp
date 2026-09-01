import 'package:dio/dio.dart';

class GeocodingService {
  final Dio _dio;
  GeocodingService(this._dio);

  // ponytail: 5-min in-memory cache + throttle via _dio usage. Upgrade to persistent if needed.
  final Map<String, ({String value, DateTime expires})> _cache = {};
  DateTime _lastCall = DateTime.fromMillisecondsSinceEpoch(0);

  Future<void> _throttle() async {
    final wait = DateTime.now().difference(_lastCall).inMilliseconds;
    if (wait < 1100) await Future.delayed(Duration(milliseconds: 1100 - wait));
    _lastCall = DateTime.now();
  }

  Future<List<Map<String, dynamic>>> search(String query) async {
    if (query.trim().length < 3) return [];
    await _throttle();
    final r = await _dio.get(
      'https://nominatim.openstreetmap.org/search',
      queryParameters: {'format': 'json', 'q': query, 'limit': 5, 'addressdetails': 1},
      options: Options(headers: {'User-Agent': 'NexoApp/1.0'}),
    );
    return (r.data as List).cast<Map<String, dynamic>>();
  }

  Future<String?> reverse(double lat, double lng) async {
    final key = '${lat.toStringAsFixed(5)},${lng.toStringAsFixed(5)}';
    final cached = _cache[key];
    if (cached != null && DateTime.now().isBefore(cached.expires)) return cached.value;
    try {
      await _throttle();
      final r = await _dio.get(
        'https://nominatim.openstreetmap.org/reverse',
        queryParameters: {'format': 'json', 'lat': lat, 'lon': lng, 'addressdetails': 1},
        options: Options(headers: {'User-Agent': 'NexoApp/1.0'}),
      );
      final v = r.data['display_name'] as String?;
      if (v != null) _cache[key] = (value: v, expires: DateTime.now().add(const Duration(minutes: 5)));
      return v;
    } catch (_) {
      return null;
    }
  }
}
