import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/routing/desktop_router.dart';
import 'theme/app_theme.dart';

class NexoDesktopApp extends ConsumerWidget {
  const NexoDesktopApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(desktopRouterProvider);
    return MaterialApp.router(
      title: 'Nexo',
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}