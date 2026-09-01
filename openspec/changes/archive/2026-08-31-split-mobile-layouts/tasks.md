## 1. Roles & Permisos (Server + Flutter)

- [x] 1.1 Actualizar `server/src/db/models/user.ts:34` y `server/src/types/models.d.ts:3` al enum de 8 roles, eliminar `viewer|editor|it`
- [x] 1.2 Actualizar `server/src/middlewares/tenantGuard.ts` con `isAdminLike` y helper `requireDeptScope` para supervisor
- [x] 1.3 Actualizar `server/src/controllers/companiesController.ts:67` a `business_owner|admin|platform_admin` para geofence
- [x] 1.4 Actualizar `server/src/services/managerService.ts:10` y `server/src/repositories/managerRepository.ts:11` para nuevo enum
- [x] 1.5 Crear `server/scripts/migrate-rename-roles.ts` (mapea legacy→nuevo, idempotente) y validar en staging
- [x] 1.6 Flutter: actualizar `app/lib/data/models/user_model.dart` y `app/lib/core/auth/auth_state.dart` con helpers `isAdminLike/isSupervisor/isHrManager` y `roleGuards.dart` compartido
- [x] 1.7 Añadir `attachmentUrl` a `server/src/db/models/permission.ts` + Zod schema (mime pdf/jpg/png, 5MB) + `permissionRepository`

## 2. Routing — Separación Desktop / Móvil

- [x] 2.1 Crear `app/lib/core/routing/desktop_router.dart` y `mobile_router.dart` extrayendo `app_router.dart:9`
- [x] 2.2 Implementar `ShellRoute` para `DesktopShell`, `AdminMobileShell`, `EmployeeMobileShell` con guards por rol
- [x] 2.3 Actualizar `app/lib/presentation/mobile/navigation/splash_screen.dart:41` y `features/auth/screens/login_screen.dart:40` para redirigir a `/home` vs `/admin` vs `/` según rol; bloquear `platform_admin|support` en móvil
- [x] 2.4 Actualizar `app/lib/main_desktop.dart` y `main_mobile.dart` para importar su router correspondiente; deprecar `app_router.dart`

## 3. Shells & UI Responsiva

- [x] 3.1 Crear `app/lib/presentation/desktop/shells/desktop_shell.dart` extrayendo `_Drawer` duplicado de `dashboard_screen.dart:127` y `employee_list_screen.dart:158`
- [x] 3.2 Crear `app/lib/presentation/mobile/shells/employee_shell.dart` (bottom 4 + drawer MI JORNADA/MIS SOLICITUDES/CUENTA)
- [x] 3.3 Crear `app/lib/presentation/mobile/shells/admin_shell.dart` (bottom Dashboard/Equipo/Órdenes/Solicitudes con badge + drawer OPERACIÓN/TALENTO/ADMIN)
- [x] 3.4 Eliminar `app/lib/presentation/mobile/widgets/page_shell.dart` y migrar `home_screen.dart`, `history_screen.dart`, `vacations_screen.dart`, `permissions_screen.dart` a su shell
- [x] 3.5 Hacer `dashboard_screen.dart` responsivo con `LayoutBuilder` (Wrap/cards <600dp, tabla ≥600dp)
- [x] 3.6 Unificar `logout` en `app/lib/data/repositories/auth_repository_impl.dart` → `AuthRepository.logout()` y reemplazar llamadas en `page_shell`, `settings_screen.dart:45`, `dashboard_screen.dart:188`

## 4. Solicitudes Unificadas & Adjuntos

- [x] 4.1 Crear `app/lib/features/requests/screens/admin_requests_screen.dart` (tabs Pendientes/Aprobadas/Rechazadas) + `admin_request_detail_screen.dart` (`admin/requests/:id`) con aprobar/rechazar
- [x] 4.2 Crear `app/lib/features/requests/screens/my_requests_screen.dart` (Mis Solicitudes con 2 cards) para empleado
- [x] 4.3 Implementar upload de certificado en `permissions_screen.dart` (type=licencia) → `multipart/form-data` a `POST /api/permissions` con `attachmentUrl`
- [x] 4.4 Server: validar department scope para supervisor y `hr_manager|business_owner` para approve en `permissionController`/`vacationController`
- [x] 4.5 Añadir deep link `admin/requests/:id` desde push (`pushToken` + Socket.io)

## 5. Mapa Vivo & Reportes Móvil

- [x] 5.1 Crear `app/lib/features/attendance/screens/live_map_screen.dart` (`/admin/attendance`) con `flutter_map` + markers de última `location` por empleado + polling/Socket
- [x] 5.2 Añadir `share_plus` y `connectivity_plus` (y `hive`/`shared_preferences`) a `pubspec.yaml`
- [x] 5.3 Implementar `ReportRepository.exportExcel()` share en móvil-admin (`Share.shareXFiles`) y mantener descarga en desktop

## 6. Offline Attendance (Cache + Queue)

- [x] 6.1 Crear `app/lib/core/storage/location_cache.dart` (lastPosition 24h + company.geofence cache 1h)
- [x] 6.2 Crear `app/lib/core/storage/pending_queue.dart` (Hive box `pending_timecontrols` con `pendingSync,isCached,isOffline,geofencePassLocal`)
- [x] 6.3 Modificar `app/lib/features/home/screens/home_screen.dart:88` para fallback a cache, validación haversine local opcional, enqueue y Snack offline
- [x] 6.4 Implementar `SyncService` con `connectivity_plus` watcher que hace `POST /api/locations` en orden y limpia queue en 2xx
- [x] 6.5 Server: marcar `geofenceValidated` en `timeControl` al sync y retornar resultado

## 7. QA & Migración

- [x] 7.1 Tests de router por rol (8 roles × 3 shells) y guards de department
- [x] 7.2 Test de migración de roles en staging y rollback plan (alias 1 versión)
- [x] 7.3 QA manual: deep links, offline→online, export share a Drive/WhatsApp, adjunto licencia
