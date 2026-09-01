import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/routing/mobile_router.dart';
import '../../core/theme/nexo_theme.dart';
import '../../core/theme/theme_controller.dart';

class NexoMobileApp extends ConsumerWidget {
  const NexoMobileApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(mobileRouterProvider);
    final themeMode = ref.watch(themeModeProvider);
    return MaterialApp.router(
      title: 'Nexo',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      theme: NexoTheme.light,
      darkTheme: NexoTheme.dark,
      themeMode: themeMode,
    );
  }
}