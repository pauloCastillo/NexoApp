import 'package:flutter/material.dart';

class MobileAppTheme {
  static ThemeData get light => ThemeData(
        colorSchemeSeed: const Color(0xFF4F6DFF),
        useMaterial3: true,
        brightness: Brightness.light,
        appBarTheme: const AppBarTheme(centerTitle: true, elevation: 0),
      );
}