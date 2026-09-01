# Resumen Auditoría — NexoApp

**Rama:** `01-Auditoria-del-codigo` | **Fecha:** 2026-08-31 | **Scope:** `server/` (104 archivos, ~4681 LOC) + `app/lib/` | **Agentes:** `@agente-grasp` + `@agente-solid` + `@Code Reviewer` (paralelo, `review-code` orquestador, guardrail `grasp/solid → reviewer` depth=1)

## Top Hallazgos consolidados (deduplicados)

Orden por **Sev Crítica → Alta → Major**, sin duplicar GRASP/SOLID/Code Reviewer (referencia cruzada cuando solapan).

| # | Sev | Origen | Archivo:Línea | Hallazgo | Acción mínima propuesta (sin aplicar) |
|---|---|---|---|---|---|
| 1 | Crítica | Code Review | `server/src/utils/geofence.ts:30` | Geofence abierto si `candidates.length===0` → `inside:true` | Retornar `inside:false`; exigir ≥1 sucursal activa. Ref `GRASP-resumen` |
| 2 | Crítica | Code Review + GRASP | `server/src/middlewares/tenantGuard.ts:38` vs `routes/work-orders, employees` | Tenant isolation incompleto: `requireCompanyAccess` solo en `branches` | Middleware global `verifiedToken`+`requireCompanyAccess` en `main.ts:54` con allowlist |
| 3 | Crítica | Code Review | `server/main.ts:31` | CORS refleja cualquier Origin si `CLIENT_URL` vacío | `origin: allowedOrigins ?? []`, fail si `!isDev && !CLIENT_URL` |
| 4 | Crítica | Code Review | `server/src/utils/utils.ts:31` + `authService:158` | JWT 24h/7d en storage sin httpOnly, sin revocación global | Access 15min httpOnly cookie, refresh rotativo con `jti` |
| 5 | Crítica | GRASP+SOLID | `server/src/services/authService.ts:9` | God Service 259L, SRP/High Cohesion roto | Extraer `InvitationService` + `TokenService` |
| 6 | Crítica | GRASP+SOLID | `server/src/routes/invitations.ts:24` | Fat Route 167L, Controller/SRP | Extraer `InvitationController`+`InvitationService` |
| 7 | Crítica | GRASP | `server/src/controllers/locationController.ts:19` | `Location.find` bypasea `#companyFilter` | Usar `LocationRepository.getAllLocations(ctx)` |
| 8 | Alta | Code Review | `server/src/services/authService.ts:29` | Registro `Company+User` sin transacción → empresa huérfana | `session.withTransaction` + índice único collation |
| 9 | Alta | Code Review | `server/src/services/workOrderService.ts:38` | Race transición TOCTOU `pendiente→en_progreso` | `findOneAndUpdate` atómico con filtro `status` |
| 10 | Alta | Code Review | `server/src/repositories/timeControlRepository.ts:15` | IDOR `findByIdAndUpdate` sin filtrar `company` | `findOneAndUpdate({_id, company}, ...)` |
| 11 | Alta | Code Review | `server/main.ts:95` + `routes/locations.ts:17` | Socket namespace sin auth | `socketAuth(verifyingSession)` en `io.of('/api/...').use` |
| 12 | Alta | Code Review | `server/src/routes/work-orders.ts:16` + `locations.ts:15` | Rutas sin Zod → NoSQL injection, lat/lng no validados | Añadir `validate(schema)` con `z.number().min(-90).max(90)` |
| 13 | Major | GRASP+SOLID | `server/src/factories/serviceFactory.ts:20` | `switch(string)` OCP/DIP roto, `any` | Registry `Map<string,FactoryFn>` + `ServiceType` union |
| 14 | Major | SOLID+GRASP | `server/src/repositories/locationRepository.ts:34` | Repo hace geofence+geocoding+persistencia (SRP/Expert) | Extraer `GeofenceService` + `GeocodingService` |
| 15 | Major | Clean | `server/src/db/models/workOrder.ts:37` | Enum ES `"pendiente","en_progreso"...` no inglés | `["pending","in_progress"...] // domain: pendiente (ES)` |
| 16 | Major | Clean | `app/lib/features/auth/screens/register_screen.dart:277` | God Widget 916L, `build` >20L | Extraer `RegisterFormStepOne/Two` + `RegisterController` |
| 17 | Major | SOLID | `server/src/services/employeeService.ts:5` | Herencia LSP frágil `UserService` | Composición `UserRepository` |
| 18 | Media | SOLID | `server/src/report/index.ts:3` | `currentDate` global + `xlsx.writeFile("asistencia.xlsx")` hardcode | Inyectar `clock` + `writer`, retornar `Buffer` |

> Resto (Minor/Media) en reportes individuales. Total priorizados: 18 (deduplicados de 15+15+15 → 45 brutos).

## Partición por agente (sin solapamiento)
- **GRASP:** cohesión/acoplamiento/Controller/Expert/Protected Variations (estructural OOP)
- **SOLID/Clean:** SRP/OCP/LSP/ISP/DIP + naming inglés + funciones pequeñas (diseño)
- **Code Reviewer:** security (geofence, tenant, CORS, JWT, socket), correctness (transacciones, race, validación), performance (geocoding, payload), testing

## Próximos pasos (espera `aprobado`/`procede` por hallazgo)
1. **Antes de deploy:** #1-4 (geofence, tenant, CORS, JWT) + #5-7 (God Service/Fat Route/bypass)
2. **Mismo sprint:** #8-12 (transacciones, race, IDOR, socket auth, Zod)
3. **Deuda planificada:** #13-18 (factory, repo SRP, enums, widgets)

Cada fix: diff mínimo 1 archivo, tag `// ponytail: GRASP/SOLID fix - [principio]` o `// ponytail: security fix`, 1 test por Sev Crítica (`mongodb-memory-server` + `jest`).

## Archivos generados
- `docs/auditoria/GRASP-reporte.md` — 15 hallazgos GRASP
- `docs/auditoria/SOLID-CLEAN-reporte.md` — 15 hallazgos SOLID/Clean
- `docs/auditoria/SEGURIDAD-CODE-REVIEW-reporte.md` — 15 hallazgos security/correctness
- `docs/auditoria/resumen.md` — este archivo (18 consolidados)

> Todos los reportes son solo lectura. Ningún `server/`/`app/lib/` fue editado. Para aplicar un fix, responde `aprobado #<n>` o `procede con #<n>`.

## Verificación
```bash
ls docs/auditoria/
# GRASP-reporte.md  SOLID-CLEAN-reporte.md  SEGURIDAD-CODE-REVIEW-reporte.md  resumen.md
git log --oneline -5
# rama 01-Auditoria-del-codigo
```
