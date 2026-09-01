# Auditoría SOLID + Clean Code — NexoApp

**Rama:** `01-Auditoria-del-codigo` | **Fecha:** 2026-08-31 | **Agente:** `@agente-solid` (`.opencode/agents/agente-solid.md`) | **Scope:** `server/` + `app/lib/` | **Excludes:** `node_modules/`, `dist/`, `build/`, `.dart_tool/`, `vendors/`, `*.g.dart`, `*.freezed.dart` | **Modo:** solo reporte, cero edits

## Checklist SOLID + Clean

SOLID: SRP/OCP/LSP/ISP/DIP. Clean: nombres 100% inglés (traducir dominio ES con `// domain: ...`), no muy largas pero legibles, funciones ≤20L/≤3 args, DRY/KISS, comentarios, formato.

## Hallazgos priorizados

| Principio | Sev | Archivo:Línea | Por qué | Sugerencia mínima |
|---|---|---|---|---|
| SRP | Critical | `server/src/services/authService.ts:8` | God Service: 6 razones de cambio (`registerOwner`/`registerUser`/`login`/`refreshToken`/`changePassword`/`logout`) + mezcla hashing JWT + `Company` + `Invitation` consume + `auditLog`. 259L, `throw {statusCode,message}` legado | Extraer `InvitationService.consume()` y `TokenService`; `authService` solo orquesta. Migrar throws a `AppError` |
| SRP | Major | `server/src/routes/invitations.ts:24` | Route = Controller+Service+Repo: valida dept/branch (`Department.findOne`/`Branch.findOne` L33-44), genera `crypto.randomBytes` L46, crea `Invitation` L50, audit + socket. 167L sin capa servicio | Mover a `invitationService.create(data,ctx)` + `invitationRepository`; route solo `validate(schema)` + `res.json` |
| OCP | Major | `server/src/factories/serviceFactory.ts:20` | `switch(serviceType:string)` cerrado a modificación: nuevo servicio obliga editar factory. Sin registro extensible | `const registry:Record<string,()=>any>={employee:()=>new EmployeeService(ctx)}; return wrap(registry[type]())` o DI container |
| DIP | Major | `server/src/factories/serviceFactory.ts:4-15` | Depende de concretos (`new EmployeeService`, `new TimeControlRepository`) importados directo. `createErrorProxy` envuelve instancia concreta | Inyectar abstracciones: `constructor(repo: LocationRepositoryPort)` + registrar interfaces; factory recibe `map<type,FactoryFn>` |
| SRP | Major | `server/src/repositories/locationRepository.ts:34` | `createLocation` hace 3 cosas: resuelve geofence (L38-54 `User`+`Branch`+`Company`+`evaluateGeofence`+override), `reverseGeocode` L60, y `findOneAndUpdate $push` L62 | Extraer `GeofenceService.evaluate(lat,lng,userId,companyId)` y `GeocodingService`; repo solo persiste `geofenceResult` ya calculado |
| SRP | Major | `server/src/controllers/locationController.ts:25` | `_raw_registerEmployeesTimeLocation` 63L: arma `timeData`+`locationData` L30-47, llama 2 servicios via `ServiceFactory` L49+64, inyecta `geofenceResult` L61-63, `auditLog` + `getIO().emit` L67-77, construye `warning` L79. >20L, >3 responsabilidades | Extraer `AttendanceOrchestrator.register(dto,ctx)` que devuelva `{newTime,warning}`; controller solo `res.json` |
| SRP | Major | `server/src/report/index.ts:15` | `createReport` mapea dominio + crea workbook + `sheet_add_aoa` + `xlsx.writeFile("asistencia.xlsx")` L50 sync I/O con `currentDate` global L4. Sin inyección de `filePath`/`date` — imposible testear | `function createReport(rows, {writeFile=xlsx.writeFile, date=new Date()}={})` y separar `mapToSheetRows` |
| OCP | Major | `server/src/utils/normalizeError.ts:58` | Cadena `if/else` + regex frágil `/Transición inválida\|Solo órdenes\|No se puede cancelar\|WorkOrder not found/i` L60. Nuevo mensaje = editar función | Repository/Service lanzan `AppError('WORKORDER_TRANSITION')` tipado; `normalizeError` solo mapeo `code→catalogEntry`, sin regex |
| LSP | Major | `server/src/services/employeeService.ts:5` | `EmployeeService extends UserService` estrecha contrato: `super.getAll()` sin filtro vs `getAll()` filtra `['employee',...]` L7, y `create()` produce side-effects extra (`ControlTime`+`JobTitle`+`refreshTokenHash` L16-31) | Favor composición: `EmployeeService { constructor(private users: UserService, private timeControls: ...) }` sin heredar |
| SRP/DRY | Major | `server/src/controllers/workOrdersController.ts:54,68,82` | `start`/`complete`/`cancel` duplican `try{ serviceFactory+repo.getById+audit }catch(e){res BAD_REQUEST}` 3× | Extraer `handleTransition(req,res, (svc)=>svc.start(id))` helper + mover audit a service decorator |
| SRP | Minor | `server/src/middlewares/tenantGuard.ts:6` | 4 middlewares distintos en 1 archivo (55L): `requireRole` L6, `requireDeptScope` L17, `requireSuperuser` L34, `requireCompanyAccess` L38. 1 archivo = 4 razones de cambio | Split `requireRole.ts` / `requireDeptScope.ts`; o al menos export único `tenantGuard` composable |
| SRP | Minor | `server/src/db/models/user.ts:73` | `pre('save') encryptPassword` L73 + `methods.authenticateUser` L80 (hace `model('User').findById` dentro de instancia, re-consulta), `createToken`, `toJSON`. 3 responsabilidades en modelo — allowlist atenuado | Si se mantiene, añadir `// Active Record: persistencia+hooks intencional` y mover `authenticateUser` a `authService.checkingPassword` |
| Clean: Naming 100% inglés | Major | `server/src/db/models/workOrder.ts:37` | Enum dominio en ES: `"pendiente","en_progreso","completado","cancelado"` L38. `server/src/services/workOrderService.ts:4` usa `pendiente` como clave `VALID_TRANSITIONS` | `enum: ["pending","in_progress","completed","cancelled"] // domain: pendiente (ES) — WorkOrder status` + mapear en `toJSON` si UI necesita ES |
| Clean: Funciones ≤20L / ≤3 args | Major | `app/lib/features/auth/screens/register_screen.dart:277` | `RegisterScreen` 916L God Widget; `build` L277 + `_formCard` L404 (~200L) + `_stepTwo` L708 (~208L) superan 20L, 8 controllers + 4 `GlobalKey/FormState` en State | Extraer `RegisterFormStepOne`/`StepTwo` widgets + `RegisterController(Notifier)`; cada `build` ≤20L |
| Clean: Naming | Minor | `app/lib/features/auth/screens/register_screen.dart:388` | `Widget _chip(IconData i, String l)` params `i`/`l` 1-char no legibles | `Widget _chip(IconData icon, String label)`; renombrar `final _nameCtrl`, `_emailCtrl` + `// domain: Empresa (ES) → Company` donde aplica |

## Fuera de top 15 (priorizar si se pide)
- `[CLEAN] DRY app/lib/data/datasources/*:6` — 8 `*RemoteSource` duplican `try{Dio}on DioException→dioToFailure` + `Future<Result<T>>` + compat `throw Exception` wrapper: extraer `handleDio<T>(()=>dio.get(...), parser)`
- `[SOLID] DIP app/lib/data/repositories/employee_repository_impl.dart:5` depende de concreto `EmployeeRemoteSource` sin interfaz `EmployeeDataSource` — inyectar abstracción
- `[SOLID] ISP app/lib/domain/employee/repositories/employee_repository.dart:3` 5 métodos obligan a mocks que solo usan `getAll` — segregar `ReadableEmployeeRepo`/`Writable`
- `[CLEAN] Naming server/src/report/index.ts:44` headers `"Nombre/Entrada/Descanso"` ES sin `// domain:` — traducir a `name/checkInStart/checkInEnd` + comment
- `[CLEAN] Naming app/lib/core/auth/biometric_auth.dart:16` `reason='Autentícate…'` literal ES en firma — param inglés + i18n

## Regla dominio
Nombres siempre inglés. Si dominio original ES (`Sucursal`, `Marcación`, `Empresa`), traduce (`Branch`, `CheckIn`, `Company`) y deja `// domain: Sucursal (ES) — Branch` junto a declaración. Sin comentario = violación Minor.

> Propuestas son diff mínimo 1 archivo, sin capas especulativas. Espera `aprobado`/`procede` antes de editar.
