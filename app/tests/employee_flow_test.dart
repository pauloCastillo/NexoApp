import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:nexo_app/data/models/company_model.dart';
import 'package:nexo_app/data/models/user_model.dart';
import 'package:nexo_app/presentation/desktop/desktop_app.dart';
import 'package:nexo_app/data/repositories/auth_repository.dart';
import 'package:nexo_app/features/auth/providers/auth_provider.dart';
import 'package:nexo_app/features/companies/providers/company_provider.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

Widget createTestApp({
  required AuthRepository authRepo,
}) {
  return ProviderScope(
    overrides: [
      authRepositoryProvider.overrideWithValue(authRepo),
      publicCompaniesProvider.overrideWith((_) async => <CompanyModel>[]),
    ],
    child: const MaterialApp(home: NexoDesktopApp()),
  );
}

void main() {
  late MockAuthRepository authRepo;

  setUp(() {
    authRepo = MockAuthRepository();
    FlutterSecureStorage.setMockInitialValues({});
  });

  Future<void> fillTextField(WidgetTester tester, String label, String value) async {
    final tf = find.widgetWithText(TextField, label);
    await tester.ensureVisible(tf);
    await tester.tap(tf);
    await tester.enterText(tf, value);
  }

  testWidgets('Registrar usuario y navegar al home', (tester) async {
    const testEmail = 'test@nexoapp.com';
    const testPassword = 'password123';

    when(() => authRepo.register(
      any(),
      any(),
      any(),
      companyName: any(named: 'companyName'),
      role: any(named: 'role'),
      companyId: any(named: 'companyId'),
      phone: any(named: 'phone'),
    )).thenAnswer(
      (_) async => UserModel(
        id: 'u1',
        email: testEmail,
        name: 'Juan Pérez',
        role: 'business_owner',
        companyId: 'c1',
      ),
    );

    await tester.pumpWidget(createTestApp(authRepo: authRepo));
    await tester.pumpAndSettle();

    expect(find.text('Nexo'), findsOneWidget);

    final regBtn = find.widgetWithText(TextButton, 'Regístrate');
    await tester.ensureVisible(regBtn);
    await tester.tap(regBtn);
    await tester.pumpAndSettle();

    expect(find.text('Regístrate en Nexo'), findsOneWidget);

    await fillTextField(tester, 'Nombre', 'Juan');
    await fillTextField(tester, 'Apellido', 'Pérez');
    await fillTextField(tester, 'Correo Electrónico', testEmail);
    await fillTextField(tester, 'Nombre de Empresa', 'Mi Empresa');
    await fillTextField(tester, 'Contraseña', testPassword);
    await fillTextField(tester, 'Confirmar Contraseña', testPassword);

    await tester.tap(find.widgetWithText(FilledButton, 'Registrarse'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Dashboard'), findsOneWidget);
  });

  testWidgets('Login redirige a página principal', (tester) async {
    const testEmail = 'test@nexoapp.com';
    const testPassword = 'password123';

    when(() => authRepo.login(testEmail, testPassword)).thenAnswer(
      (_) async => UserModel(
        id: 'u1',
        email: testEmail,
        name: 'Juan Pérez',
        role: 'business_owner',
        companyId: 'c1',
      ),
    );

    await tester.pumpWidget(createTestApp(authRepo: authRepo));
    await tester.pumpAndSettle();

    expect(find.text('Nexo'), findsOneWidget);

    await fillTextField(tester, 'Email', testEmail);
    await fillTextField(tester, 'Contraseña', testPassword);

    await tester.tap(find.widgetWithText(FilledButton, 'Iniciar sesión'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('Dashboard'), findsOneWidget);
  });
}
