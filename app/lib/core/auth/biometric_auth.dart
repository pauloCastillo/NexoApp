import 'package:flutter/services.dart';

/// BiometricAuth stub — preparada para local_auth sin añadir dep aún.
/// Uso futuro: if (await BiometricAuth.isAvailable) await BiometricAuth.authenticate()
/// ponytail: no dep added now, plug local_auth when needed; keep hook in login UI.
class BiometricAuth {
  static Future<bool> get isAvailable async {
    try {
      // placeholder: check platform without plugin — will return false until local_auth added
      return false;
    } on PlatformException {
      return false;
    }
  }

  static Future<bool> authenticate({
    String reason = 'Autentícate para continuar',
  }) async {
    // Hook for a future local_auth integration.
    // final auth = LocalAuthentication();
    // return await auth.authenticate(localizedReason: reason, options: const AuthenticationOptions(biometricOnly: true, stickyAuth: true));
    return false;
  }
}
