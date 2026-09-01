import 'package:flutter/material.dart';
import 'package:nexo_app/core/theme/nexo_theme.dart';

// ponytail: re-export NexoTheme J2 to keep existing imports working
class AppTheme {
  static ThemeData get light => NexoTheme.light;
  static ThemeData get dark => NexoTheme.dark;
}
