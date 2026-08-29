import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/routing/mobile_router.dart';
import 'theme/app_theme.dart';

class NexoMobileApp extends ConsumerWidget {
  const NexoMobileApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(mobileRouterProvider);
    return MaterialApp.router(
      title: 'Nexo',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      theme: MobileAppTheme.light,
    );
  }
}