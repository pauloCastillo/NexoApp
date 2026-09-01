## 1. Modelos & Migración

- [x] 1.1 Crear `server/src/db/models/branch.ts` con `{name, address, location{lat,lng}, geofenceRadius 50-2000, geofenceType:'circle', company ref, isActive, createdBy}` + índices `{company,name} unique` y timestamps
- [x] 1.2 Extender `server/src/types/models.d.ts` con `IBranch` + `IGeofenceResult` + `User.branches?` + `IControlTime.geofenceValidated` + `ISubLocation.geofenceResult`
- [x] 1.3 Extender `server/src/db/models/user.ts` con `branches: ObjectId[] ref Branch`, `timeControl.ts` con `geofenceValidated`, `locations.ts` con `geofenceResult` sub-doc
- [x] 1.4 Exportar `Branch` en `server/src/db/models/index.ts` y crear `server/src/utils/geofence.ts` (`haversineDistance`, `evaluateGeofence` con fallback chain)
- [x] 1.5 Crear `server/src/utils/geocoding.ts` (cache 5 min + throttle 1/s) y `server/scripts/migrate-company-location-to-branch.ts` + `package.json:migrate:branches`

## 2. API & Validación

- [x] 2.1 Crear `server/src/schemas/branch.ts` (`createBranchSchema`, `updateBranchSchema`, `assignBranchesSchema` max 10) y exportar en `schemas/index.ts`
- [x] 2.2 Implementar `server/src/controllers/branchesController.ts` (list/get/create/update/delete) con `CAN_EDIT=[business_owner,supervisor,superuser,platform_admin]`, `CAN_VIEW=+admin+hr_manager`, límite 20, `reason` obligatorio al mover, audit `branch.*`
- [x] 2.3 Crear `server/src/routes/branches.ts` (auto-mount `/api/branches`) y `server/src/controllers/employeeBranchesController.ts` + `PUT /api/employees/:id/branches` (validar `branch.company == employee.company`, audit `employee.branches.assigned`)
- [x] 2.4 Refactor `server/src/repositories/locationRepository.ts`: branch-aware `evaluateGeofence`, warning (no throw), tenant check `User.findOne({_id, company})`, fix `existLocation` con `_injectedGeofenceResult`, usar `reverseGeocode`
- [x] 2.5 Actualizar `server/src/repositories/timeControlRepository.ts` para `geofenceResult` y `server/src/controllers/locationController.ts` para `override/overrideReason`, propagación limpia y `warning` en response, tipar `ILocationTimeData.override`

## 3. Flutter — Empresa & Geofence UX

- [x] 3.1 Crear `app/lib/data/models/branch_model.dart`, `branch_remote_source.dart`, `branch_repository.dart/.impl` y `features/companies/providers/branch_provider.dart` + `core/services/geocoding_service.dart` (cache+throttle via Dio)
- [x] 3.2 Reescribir `app/lib/features/companies/screens/company_settings_screen.dart` → lista + `_BranchMapForm` con buscador Nominatim (debounce 400ms), "mi ubicación" (geolocator + LocationSettings), pin tap+reverse, slider 50-2000, confirm dialog, motivo obligatorio, delete soft, auditoría via `GET /audit-logs`
- [x] 3.3 Actualizar `app/lib/features/home/screens/home_screen.dart` para warning naranja + dialog override supervisor (motivo) con `LocationSettings` y `(payload as Map)['override']` fix

## 4. Asignación Multi-zona

- [x] 4.1 Extender `app/lib/domain/employee/entities/employee_model.dart` con `branches: List<String>` y `fromJson` branches
- [x] 4.2 Crear `app/lib/presentation/desktop/widgets/branch_assignment_dialog.dart` (FilterChip multi-select max 10) y añadir botón Zonas en `presentation/desktop/widgets/employee_table.dart`

## 5. QA & Limpieza

- [x] 5.1 Fix lint `locationRepository` useless-assignment, `geocoding_service` unused_field, `branch_remote_source` null-aware, `home/companies` `timeLimit` deprecated → `LocationSettings`, `company_settings_screen` delete audit button
- [x] 5.2 Añadir `server/src/__tests__/geofence.test.ts` (haversine, inside/outside/fallback/closest), actualizar `package.json` migrate script, `flutter analyze` 0 errors
- [x] 5.3 Verificar `pnpm typecheck` 0 errors, `pnpm lint` 0 errors (398 warnings preexistentes), `pnpm test` 88 passed (5 nuevos geofence)
