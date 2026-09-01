## Why

Un único `PageShell` y un solo `goRouter` mezclan desktop y móvil y exponen ítems de admin a empleados (y viceversa). No existe layout diferenciado para administrativos en móvil ni cola unificada de solicitudes, lo que impide aprobar vacaciones/permisos/licencias desde el teléfono y escalar roles con bajo acoplamiento.

## What Changes

- **BREAKING** Normaliza roles a 8 códigos en inglés: `superuser`, `platform_admin`, `support` (solo desktop), `business_owner`, `admin`, `supervisor`, `hr_manager`, `employee`. Elimina `viewer`, `editor`, `it`; migra `manager`→`supervisor`, `hr`→`hr_manager`. Actualiza `user.ts`, `types/models.d.ts`, `tenantGuard`, `managerService/Repository`, `companiesController`, y `auth_state` en Flutter.
- Parte routing en `desktop_router.dart` y `mobile_router.dart` con `ShellRoute` para 3 shells: `DesktopShell`, `AdminMobileShell`, `EmployeeMobileShell`. Elimina duplicación de `_Drawer` y corrige redirect de `platform_admin`/`support` en móvil.
- Introduce `AdminMobileShell` con dashboard responsivo (mismo `DashboardScreen` adaptativo), mapa vivo de asistencias, y cola `Solicitudes` (`admin/requests` + `admin/requests/:id`) para aprobar/rechazar vacaciones/permisos/licencias (supervisor solo su `department`; vacaciones/permisos solo `hr_manager`/`business_owner`; workOrders supervisor aprueba, `business_owner` edita).
- Unifica solicitudes de empleado en `Mis Solicitudes` (cards Vacaciones / Licencias & Permisos) con soporte de **adjunto** (certificado médico) para `licencia`.
- Unifica `logout` en `AuthRepository.logout()`.
- Añade export/compartir de reportes en móvil-admin (Excel + `share_plus` a Drive/WhatsApp) y estrategia offline para marcajes: cache de última posición + queue local con `pendingSync` y validación diferida de geocerca.

## Capabilities

### New Capabilities
- `role-model`: catálogo y guards de 8 roles, migración y matriz de permisos por recurso.
- `layouts`: 3 shells (desktop, mobile-admin, mobile-employee), routers separados y navegación por rol.
- `request-queue`: cola unificada de solicitudes, aprobación por rol/departamento, y adjuntos para licencias.
- `offline-attendance`: cache de última posición, queue offline y sincronización con validación de geocerca.
- `report-sharing`: exportación y compartido de reportes en móvil-admin.

### Modified Capabilities
- (ninguna existente — `openspec/specs` vacío)

## Impact

- **Flutter** `app/lib/core/routing`, `core/auth/auth_state`, `presentation/desktop|mobile/shells`, `presentation/mobile|desktop/theme`, `features/requests|dashboard|reports|home`, `data/models/user_model`, `core/storage`, `pubspec.yaml` (`share_plus`, `connectivity_plus`, `hive`/`shared_preferences`).
- **Server** `src/db/models/user`, `src/types/models.d.ts`, `src/middlewares/tenantGuard`, `src/controllers/companiesController`, `src/services/managerService`, `src/repositories/managerRepository`, `src/db/models/permission` (attachment), `src/repositories/permissionRepository`, `src/services/reportService`.
- **DB** migración de roles y nuevo campo `attachmentUrl` en `permissions`.
- **API** contrato de `permissions`/`vacations` con `department` check y `attachment`; report export sin cambio de contrato.
