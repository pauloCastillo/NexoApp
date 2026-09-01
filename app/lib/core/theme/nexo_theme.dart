import 'package:flutter/material.dart';

/// NexoTheme — J2 Aqua/Graphite (Jibble-inspired) + Glassmorphism motion
/// Design System: design-system/nexoapp/MASTER.md (J2 override)
/// Ponytail: single source for light/dark, no new deps.
class NexoTheme {
  // J2 palette
  static const _primaryLight = Color(0xFF00A99D); // aqua teal
  static const _primaryDark = Color(0xFF2CEAA3); // lighter teal for dark (AA on 0C1415)
  static const _secondary = Color(0xFF0F2A4A); // navy
  static const _tertiary = Color(0xFF4F6DFF);
  static const _error = Color(0xFFE03131);

  static const _bgLight = Color(0xFFF7FAFA);
  static const _surfaceLight = Color(0xFFFFFFFF);
  static const _mutedLight = Color(0xFFE8F0F0);
  static const _borderLight = Color(0xFFDDE8E8);

  static const _bgDark = Color(0xFF0C1415);
  static const _surfaceDark = Color(0xFF161E22);
  static const _mutedDark = Color(0xFF1F2E32);
  static const _borderDark = Color(0xFF23343A);

  static ThemeData get light => ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorScheme: ColorScheme.fromSeed(
          seedColor: _primaryLight,
          brightness: Brightness.light,
          primary: _primaryLight,
          onPrimary: Colors.white,
          secondary: _secondary,
          onSecondary: Colors.white,
          tertiary: _tertiary,
          onTertiary: Colors.white,
          error: _error,
          surface: _bgLight,
          onSurface: const Color(0xFF1A2B4A),
          surfaceContainerHighest: _mutedLight,
          outline: _borderLight,
        ),
        scaffoldBackgroundColor: _bgLight,
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 0,
          scrolledUnderElevation: 1,
          backgroundColor: _bgLight,
          foregroundColor: Color(0xFF1A2B4A),
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          color: _surfaceLight,
          surfaceTintColor: Colors.transparent,
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: _borderLight)),
          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: _borderLight)),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: _primaryLight, width: 1.6)),
          errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: _error)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          filled: true,
          fillColor: _mutedLight,
          hintStyle: const TextStyle(color: Color(0xFF5A6B7C)),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            backgroundColor: _primaryLight,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
            textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
          ),
        ),
        navigationDrawerTheme: NavigationDrawerThemeData(
          backgroundColor: _surfaceLight,
          surfaceTintColor: Colors.transparent,
          indicatorShape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          labelTextStyle: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) return const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: _primaryLight);
            return const TextStyle(fontWeight: FontWeight.w400, fontSize: 14, color: Color(0xFF1A2B4A));
          }),
        ),
        dividerTheme: const DividerThemeData(thickness: 1, color: _borderLight),
        dataTableTheme: DataTableThemeData(
          headingRowColor: WidgetStateProperty.all(_bgLight),
          dataRowColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.hovered)) return _mutedLight;
            return _surfaceLight;
          }),
          dataTextStyle: const TextStyle(fontSize: 14, color: Color(0xFF3A4A5A)),
          headingTextStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF5A6B7C)),
        ),
        progressIndicatorTheme: const ProgressIndicatorThemeData(color: _primaryLight),
      );

  static ThemeData get dark => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
          seedColor: _primaryDark,
          brightness: Brightness.dark,
          primary: _primaryDark,
          onPrimary: const Color(0xFF0C1415),
          secondary: const Color(0xFF6B8CFF),
          onSecondary: Colors.white,
          tertiary: const Color(0xFFFFC857),
          onTertiary: const Color(0xFF1A2B4A),
          error: const Color(0xFFFF6B6B),
          surface: _bgDark,
          onSurface: const Color(0xFFE8F0F0),
          surfaceContainerHighest: _mutedDark,
          outline: _borderDark,
        ),
        scaffoldBackgroundColor: _bgDark,
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 0,
          scrolledUnderElevation: 1,
          backgroundColor: _bgDark,
          foregroundColor: Color(0xFFE8F0F0),
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          color: _surfaceDark,
          surfaceTintColor: Colors.transparent,
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: _borderDark)),
          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: _borderDark)),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: _primaryDark, width: 1.6)),
          errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFFF6B6B))),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          filled: true,
          fillColor: _mutedDark,
          hintStyle: const TextStyle(color: Color(0xFF8A9BA8)),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            backgroundColor: _primaryDark,
            foregroundColor: const Color(0xFF0C1415),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
            textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
          ),
        ),
        navigationDrawerTheme: NavigationDrawerThemeData(
          backgroundColor: _surfaceDark,
          surfaceTintColor: Colors.transparent,
          indicatorShape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          labelTextStyle: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) return const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: _primaryDark);
            return const TextStyle(fontWeight: FontWeight.w400, fontSize: 14, color: Color(0xFFE8F0F0));
          }),
        ),
        dividerTheme: const DividerThemeData(thickness: 1, color: _borderDark),
        dataTableTheme: DataTableThemeData(
          headingRowColor: WidgetStateProperty.all(_surfaceDark),
          dataRowColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.hovered)) return const Color(0xFF1E3238);
            return _bgDark;
          }),
          dataTextStyle: const TextStyle(fontSize: 14, color: Color(0xFFCBDDE0)),
          headingTextStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF8A9BA8)),
        ),
        progressIndicatorTheme: const ProgressIndicatorThemeData(color: _primaryDark),
      );
}
