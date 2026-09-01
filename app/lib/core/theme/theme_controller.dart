import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

final themeModeProvider = StateNotifierProvider<ThemeController, ThemeMode>((ref) => ThemeController());

class ThemeController extends StateNotifier<ThemeMode> {
  static const _boxName = 'nexo_prefs';
  static const _key = 'theme_mode';

  ThemeController() : super(ThemeMode.system) {
    _load();
  }

  Future<void> _load() async {
    try {
      final box = await Hive.openBox(_boxName);
      final raw = box.get(_key) as String?;
      if (raw == 'light') state = ThemeMode.light;
      if (raw == 'dark') state = ThemeMode.dark;
      if (raw == 'system' || raw == null) state = ThemeMode.system;
    } catch (_) {}
  }

  Future<void> set(ThemeMode mode) async {
    state = mode;
    try {
      final box = await Hive.openBox(_boxName);
      await box.put(_key, mode.name);
    } catch (_) {}
  }

  void toggle() {
    if (state == ThemeMode.light) {
      set(ThemeMode.dark);
    } else if (state == ThemeMode.dark) {
      set(ThemeMode.system);
    } else {
      set(ThemeMode.light);
    }
  }
}
