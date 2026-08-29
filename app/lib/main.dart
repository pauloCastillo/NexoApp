import 'dart:io';

import 'main_desktop.dart' as desktop;
import 'main_mobile.dart' as mobile;

void main() {
  if (Platform.isAndroid || Platform.isIOS) {
    mobile.main();
  } else {
    desktop.main();
  }
}
