import 'package:share_plus/share_plus.dart';

class InviteLinkHelper {
  static String inviteLink(String code) => 'https://nexo.app/invite/$code';
  static String deepLink(String code) => 'nexo://invite/$code';
  static String whatsAppLink(String companyName, String code) {
    final text = Uri.encodeComponent('Únete a $companyName en Nexo: ${inviteLink(code)}  Código: $code');
    return 'https://wa.me/?text=$text';
  }
  static Future<void> shareWhatsApp(String companyName, String code) async {
    await Share.share('Únete a $companyName en Nexo: ${inviteLink(code)}  Código: $code');
  }
  static String? parseDeepLink(String url) {
    final uri = Uri.tryParse(url);
    if (uri == null) return null;
    // custom scheme nexo://invite/CODE -> host is invite
    if (uri.host == 'invite' && uri.pathSegments.isNotEmpty) return uri.pathSegments.first.toUpperCase();
    final segs = uri.pathSegments;
    final idx = segs.indexOf('invite');
    if (idx >= 0 && idx + 1 < segs.length) return segs[idx + 1].toUpperCase();
    return null;
  }
}
