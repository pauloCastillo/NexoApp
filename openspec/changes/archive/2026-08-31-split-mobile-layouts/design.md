## Context

Actualmente `app/lib/core/routing/app_router.dart` expone un único `GoRouter` que mezcla `desktopRoutes` y `mobileRoutes`, con un único `PageShell` (`presentation/mobile/widgets/page_shell.dart`) que muestra todos los ítems a todos los roles. Cada pantalla desktop (`dashboard_screen.dart`, `employee_list_screen.dart`) redefine su `_Drawer` por separado. El enum de roles en `server/src/db/models/user.ts:34` contiene 8 valores legacy (`viewer`, `editor`, `it`, etc.) sin mapeo claro a los 8 roles de negocio acordados. `permissions_screen.dart` y `vacations_screen.dart` son mocks locales sin cola de aprobación admin, sin adjuntos y sin flujo offline para marcajes. El redirect de `splash_screen.dart:41` manda a `platform_admin`/`support` a `/` (desktop) aunque estén en móvil.

Stakeholders: dueños/RRHH (aprueban), supervisores (por departamento), empleados (marcan/solicitan).

## Goals / Non-Goals

**Goals:**
- 3 shells desacoplados: `DesktopShell`, `AdminMobileShell`, `EmployeeMobileShell` con routers separados.
- Normalizar 8 roles y aplicar matriz de permisos por recurso/departamento.
- Cola unificada `Solicitudes` en móvil-admin y `Mis Solicitudes` en empleado con adjunto médico.
- Marcaje offline con cache de última posición y queue de sincronización.
- Export/compartir de reportes en móvil-admin.
- Unificar `logout` en `AuthRepository`.

**Non-Goals:**
- `business_client` (fuera de MVP).
- Partir backend en microservicios físicos (se deja modular monolith preparado).
- I18n, onboarding, recovery password, dashboard histórico.

## Decisions

**D1 — Routers separados + ShellRoute (vs wrapper por pantalla)**
Elegido: `main_desktop.dart` → `desktopRouter`, `main_mobile.dart` → `mobileRouter` con `ShellRoute` por shell.
Rationale: elimina leak de rutas (`/employees` en teléfono), preserva estado entre tabs, guard centralizado por shell. Alternativa B (wrapper `return AdminShell(child:)`) descartada por duplicación y olvido fácil.

**D2 — Roles: enum único + migración con alias**
Elegido: nuevo enum `['superuser','platform_admin','support','business_owner','admin','supervisor','hr_manager','employee']` en `user.ts` y `types/models.d.ts`. Script `migrate-rename-roles.ts` mapea `manager→supervisor`, `editor→hr_manager`, `hr→hr_manager`, `it→support`, `viewer→employee` (y borra huérfanos tras confirmación).
Alternativa: mantener alias runtime — descartada por deuda.

**D3 — Guards por rol y departamento**
`isAdminLike = {business_owner,admin,supervisor,hr_manager,platform_admin,superuser}`; `support` y `platform_admin` redirigidos en `mobileRouter` a `/login` con mensaje "Usa desktop". `supervisor` en `PUT /permissions/:id` y `PUT /vacations/:id` valida `req.user.department == target.department`. `vacation/permission approve` solo `hr_manager`/`business_owner` (supervisor no aprueba aunque sea su depto — decisión explícita).

**D4 — Solicitudes unificadas**
Móvil-empleado: `/my-requests` con 2 cards (Vacaciones / Licencias & Permisos) que navegan a formularios. Móvil-admin: `/admin/requests` con tabs `Pendientes|Aprobadas|Rechazadas` y `detail /admin/requests/:id` con acciones Aprobar/Rechazar. Server añade `attachmentUrl?: string` a `Permission` (solo para `type=licencia`), validado con Zod + almacenamiento en `server/uploads` o S3 (MVP: local + URL).

**D5 — Dashboard responsivo sin duplicar widget**
Mismo `DashboardScreen` envuelto en `LayoutBuilder`: `width < 600 → Wrap vertical + cards` vs tabla. Evita `DashboardScreenMobile` duplicado.

**D6 — Offline: queue A+B híbrido (cache última posición + validación local opcional)**
Cache `lastPosition` (24h) en `flutter_secure_storage` + cache `company.geofence`. En offline: `getCurrentPosition` con `timeLimit 5s` → fallback cache → `hive` box `pending_timecontrols` con `pendingSync,isCached,isOffline,geofencePassLocal`. Worker `connectivity_plus` hace sync al recuperar red. Alternativa C (bloquear marcaje) descartada por fricción en campo.

**D7 — Reportes móvil: `share_plus`**
`ReportRepository.exportExcel()` devuelve `Uint8List`; móvil-admin usa `Share.shareXFiles` para Drive/WhatsApp. Desktop mantiene descarga directa.

**D8 — Logout unificado**
`AuthRepository.logout()` → `TokenService.clearTokens()`, `ref.read(authStateProvider.notifier).state=null`, `dio` clear, `hive` clear queue meta. Screens solo llaman a ese método.

## Risks / Trade-offs

- [Migración de roles rompe JWT vigentes] → Mitigación: invalidar refresh tokens en deploy, forzar re-login; script idempotente.
- [Geocerca desactualizada offline] → Mitigación: TTL 1h + revalidación al sync; flag `geofenceValidated:false` hasta confirmación server.
- [Attachment sin validación] → Mitigación: límite 5MB, mime `pdf|jpg|png`, escaneo básico, Zod `attachmentUrl` opcional solo si `type=licencia`.
- [Supervisor ve solicitudes fuera de su depto por deep link] → Mitigación: guard en `admin/requests/:id` retorna 403 si `department` mismatch.
- [Dos routers duplican lógica redirect] → Mitigación: extraer `roleGuards.dart` compartido.

## Migration Plan

1. Deploy server: nuevo enum + script migración + `companiesController` actualizado (`business_owner,admin,platform_admin` para geofence) + `Permission.attachmentUrl`.
2. Deploy Flutter: feature flag `useSplitLayouts=false` por defecto, rollout gradual; `TokenService` limpia tokens antiguos.
3. QA: matriz de 8 roles × 3 shells, deep links, offline queue, export share.
4. Rollback: revert enum mantiene alias viejos por 1 versión; routers pueden volver a `app_router.dart` único.

## Open Questions

- TTL de cache de posición: ¿24h o 12h?
- Storage de adjuntos: ¿local disk MVP o S3 desde inicio?
- ¿Supervisor debe poder crear/editar órdenes fuera de su depto en modo lectura?
