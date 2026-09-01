import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';
import 'package:nexo_app/features/auth/screens/register_screen.dart';
import 'package:nexo_app/core/helpers/invite_link_helper.dart';
import 'package:nexo_app/data/repositories/auth_repository.dart';
import 'package:nexo_app/features/auth/providers/auth_provider.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  group('Invite helpers', () {
    test('inviteLink', () {
      expect(InviteLinkHelper.inviteLink('AB12CD34'), 'https://nexo.app/invite/AB12CD34');
    });
    test('parseDeepLink', () {
      expect(InviteLinkHelper.parseDeepLink('https://nexo.app/invite/AB12CD34'), 'AB12CD34');
      expect(InviteLinkHelper.parseDeepLink('nexo://invite/XY99ZZ00'), 'XY99ZZ00');
      expect(InviteLinkHelper.parseDeepLink('bad'), isNull);
      expect(InviteLinkHelper.parseDeepLink('/invite/ZZ11YY22'), 'ZZ11YY22');
    });
    test('whatsAppLink encodes', () {
      final link = InviteLinkHelper.whatsAppLink('Acme', 'AB12CD34');
      expect(link, contains('wa.me'));
      expect(link, contains('AB12CD34'));
    });
  });

  group('RegisterScreen', () {
    testWidgets('builds with initialCode', (tester) async {
      final repo = MockAuthRepository();
      when(() => repo.validateInvitation(any())).thenAnswer((_) async => {'company': {'name': 'Acme'}});
      await tester.pumpWidget(ProviderScope(overrides: [authRepositoryProvider.overrideWithValue(repo)], child: const MaterialApp(home: RegisterScreen(initialCode: 'AB12CD34'))));
      await tester.pump();
      expect(find.byType(RegisterScreen), findsOneWidget);
      await tester.pumpAndSettle();
    });

    testWidgets('shows collaborator segment', (tester) async {
      await tester.pumpWidget(const ProviderScope(child: MaterialApp(home: RegisterScreen())));
      await tester.pump();
      expect(find.text('Colaborador'), findsOneWidget);
      expect(find.text('Dueño'), findsOneWidget);
    });
  });
}
