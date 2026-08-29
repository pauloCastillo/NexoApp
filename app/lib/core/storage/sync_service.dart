import 'package:dio/dio.dart';
import 'pending_queue.dart';
class SyncService {
  final Dio dio;
  final PendingQueue queue;
  SyncService(this.dio, this.queue);
  Future<void> syncAll() async {
    final items = await queue.getAll();
    for (var i = items.length - 1; i >= 0; i--) {
      try {
        await dio.post('/locations', data: items[i]);
        await queue.removeAt(i);
      } catch (_) {}
    }
  }
}
