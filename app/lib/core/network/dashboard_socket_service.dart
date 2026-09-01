import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart' as io;

class DashboardSocketService {
  io.Socket? _socket;
  final _controller = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get attendanceUpdates => _controller.stream;
  final _inviteController = StreamController<Map<String, dynamic>>.broadcast();
  Stream<Map<String, dynamic>> get invitationRequests => _inviteController.stream;

  void connect(String serverUrl, String token) {
    _socket = io.io(
      '$serverUrl/api/dashboard',
      io.OptionBuilder().setTransports(['websocket']).setAuth({
        'token': token,
      }).build(),
    );
    _socket!.on('attendanceUpdate', (data) {
      _controller.add(data as Map<String, dynamic>);
    });
    _socket!.on('invitation:request_new', (data) {
      _inviteController.add(data as Map<String, dynamic>);
    });
    _socket!.connect();
  }

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
  }
}
