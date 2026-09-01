import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/routing/desktop_router.dart';
import '../../core/theme/nexo_theme.dart';
import '../../core/theme/theme_controller.dart';

class NexoDesktopApp extends ConsumerWidget {
  const NexoDesktopApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(desktopRouterProvider);
    final themeMode = ref.watch(themeModeProvider);
    return MaterialApp.router(
      title: 'Nexo',
      theme: NexoTheme.light,
      darkTheme: NexoTheme.dark,
      themeMode: themeMode,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}