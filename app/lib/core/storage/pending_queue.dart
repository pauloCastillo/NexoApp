import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class PendingQueue {
  static const _key = 'pending_timecontrols';
  final _s = const FlutterSecureStorage();
  Future<List<Map<String, dynamic>>> getAll() async {
    final v = await _s.read(key: _key);
    if (v == null) return [];
    return (jsonDecode(v) as List).cast<Map<String, dynamic>>();
  }
  Future<void> enqueue(Map<String, dynamic> entry) async {
    final list = await getAll();
    list.add({...entry, 'pendingSync': true, 'queuedAt': DateTime.now().toIso8601String()});
    await _s.write(key: _key, value: jsonEncode(list));
  }
  Future<void> removeAt(int i) async {
    final list = await getAll();
    list.removeAt(i);
    await _s.write(key: _key, value: jsonEncode(list));
  }
  Future<void> clear() => _s.delete(key: _key);
}
