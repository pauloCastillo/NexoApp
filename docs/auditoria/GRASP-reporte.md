# Auditoría GRASP — NexoApp

**Rama:** `01-Auditoria-del-codigo` | **Fecha:** 2026-08-31 | **Agente:** `@agente-grasp` (`.opencode/agents/agente-grasp.md`) | **Scope:** `server/` (104 archivos) + `app/lib/` completo | **Excludes:** `server/vendors/`, `server/dist/`, `node_modules/`, `app/build/`, `.dart_tool/`, `*.g.dart`, `*.freezed.dart` | **Modo:** solo reporte, cero edits (espera `aprobado`/`procede`)

## Metodología
Checklist 9 principios GRASP. Prioriza `Information Expert`/`Low Coupling`/`High Cohesion`/`Protected Variations`. Lectura completa de archivos críticos antes de opinar. Prefijo `[GRASP]`. Máx 15 hallazgos priorizados.

## Hallazgos priorizados

| Principio GRASP | Sev | Archivo:Línea | Por qué | Sugerencia mínima |
|---|---|---|---|---|
| High Cohesion | Critical | `server/src/services/authService.ts:9,52,132,171` | God Service 259L: `registerOwner` + `registerUser` (consume invitación) + `login` + `refreshToken` + `changePassword` + `logout` en 1 clase | Extraer `InvitationService.consume()` + `PasswordService`; `AuthService` solo sesión. `// ponytail: GRASP fix - High Cohesion` |
| Controller | Critical | `server/src/routes/invitations.ts:24,87,116,145` | Fat Route 167L: 5 handlers con `crypto.randomBytes`, `findOne`/`.populate`, `getIO().emit`, `auditLog` directo en route | Mover a `InvitationController` + `InvitationService`; route solo `verifiedToken,requireRole -> controller` |
| Low Coupling / Protected Variations | Critical | `server/src/controllers/locationController.ts:19` | `Location.find(filter)` directo bypasea `LocationRepository.#companyFilter` (usa `filter.company=companyId` manual) | Usar `ServiceFactory.getService("location")` o `LocationRepository.getAllLocations(ctx)`; eliminar import `Location` |
| Information Expert | Critical | `server/src/repositories/locationRepository.ts:34-54` | `createLocation` carga `User.branches`, `Branch`, `Company`, evalúa `evaluateGeofence` + política `override` (roles) = repo sabe de geofence y RBAC | Extraer `GeofenceService.evaluate(context, lat,lng)` (Pure Fabrication); repo solo `$push` |
| Protected Variations | Critical | `server/src/db/models/user.ts:33` vs `server/src/db/models/invitation.ts:8` | Enum desalineado: User 8 roles vs Invitation 4 roles (`employee,hr_manager,supervisor,admin`) — variación no protegida, deriva en `tenantGuard.ts:3` `isAdminLike` | Fuente única `UserRole` en `types/models.d.ts` + re-export; `invitation.role` usa mismo enum + validación `requireRole` |
| Polymorphism / Protected Variations | Major | `server/src/factories/serviceFactory.ts:23-42` | `switch(serviceType:string)` stringly-typed viola OCP/DIP: agregar servicio = editar factory | `Map<string,()=>service>` o registry DI; tipar `ServiceType` union, no `string` |
| Polymorphism (LSP) | Major | `server/src/services/employeeService.ts:5,10` + `managerService.ts:3` | Herencia `UserService<-EmployeeService<-ManagerService` con `create()` que además crea `ControlTime+JobTitle+token` (contrato distinto) | Composición sobre herencia: `EmployeeService` usa `UserRepository`; no heredar `UserService` |
| Indirection / Low Coupling | Major | `server/src/services/authService.ts:71-113` | `await import('@/db/models/index.js')` + `Invitation.findOneAndUpdate({$inc:{usedCount}})` directo acopla Auth→Invitation sin mediador | Inyectar `InvitationRepository.consume(code)` vía Indirection; Auth no conoce colección |
| Protected Variations | Major | `server/src/utils/normalizeError.ts:58-67` | `/Transición inválida\|Solo órdenes\|WorkOrder not found/i.test(msg)` frágil a string ES; rompe si cambia mensaje | `WorkOrderService` lanza `AppError('WORKORDER_TRANSITION')` con `code`; `normalizeError` mapea por `code`, no regex |
| Indirection | Major | `server/src/controllers/locationController.ts:49-65` | Orquesta `locationService.create()` + extrae `_injectedGeofenceResult` + `timerService.registerTime()` + `getIO().emit` (conoce internals de repo) | `AttendanceService.checkIn(locationData,timeData,ctx)` (Pure Fabrication) encapsula 2 servicios + geofence plumbing |
| Controller | Major | `app/lib/features/auth/screens/register_screen.dart:105,223` | Widget 916L con `_validateInvitationCode()`, `_register()`, animación y `ref.read(authRepositoryProvider).register()` = lógica en View | Mover a `AuthNotifier extends StateNotifier` (`auth_provider.dart` hoy solo expone `Provider<AuthRepository>`) |
| High Cohesion / Pure Fabrication | Major | `server/src/report/index.ts:3,15` + `server/src/services/reportService.ts:5` | `currentDate = new Date()` global + `filePath="asistencia.xlsx"` hardcode + `xlsx.writeFile` en función pura; no filtra por Protected Variations completa | `ReportService.createReport()` inyecta `clock` + `writer(path, rows)`; `createReport` recibe `Date` y retorna `Buffer` |
| Information Expert / Creator | Major | `server/src/services/employeeService.ts:10-33` | `create()` crea `User`+`ControlTime`+`JobTitle` y `signSession/hashToken` — Creator incorrecto + Expert de token en Employee | `UserRepository.create` solo User; `TimeControlService.initFor(employeeId)` separado; `TokenService` centraliza `sign/hash` |
| Low Coupling | Minor | `app/lib/data/datasources/auth_remote_source.dart:62-89` | Duplica cada endpoint: `loginResult`+`login` (throws Exception), `validateInvitationResult`+`validateInvitation` — acoplamiento temporal | Mantener solo `*Result` (Result<T>); consumidores hacen `match`; borrar wrappers `throw Exception` |
| Information Expert | Minor | `app/lib/data/repositories/auth_repository_impl.dart:16-20` | Mapeo `user['companyId']=data['companyId']??company?['id']` y `name=username` en repository, no en `UserModel.fromJson` | Mover a `UserModel.fromJson` con `companyId` fallback; repo solo `return UserModel.fromJson(data)` |

## Omitidos intencionalmente (allowlist)
`createErrorProxy.ts:4`, `proxyController.ts:8` cumplen `Indirection`; `tenantGuard.ts:17` `requireDeptScope` lazy check es variación protegida intencional. Añadir solo si rompe multi-tenant o se repite lógica en >2 sitios.

## Propuesta diff mínimo (sin aplicar — espera `aprobado`)
1. Extraer `InvitationService` (mueve lógica de `authService:71-113` + `routes/invitations.ts`) — 1 archivo nuevo, 2 archivos editados.
2. `GeofenceService` + `AttendanceService` — desacopla `locationRepository`.
3. Unificar `UserRole` enum fuente única + tipar `ServiceType` en `serviceFactory`.

> Máx 15 priorizados, resto 💭. Código primero, luego ≤3 líneas de qué se omitió y cuándo añadirlo.
