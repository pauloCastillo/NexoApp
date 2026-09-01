## Why

La pestaña Empresa hoy solo soporta una geocerca por empresa (`Company.location + geofenceRadius`) validada con `403` duro. Operaciones reales requieren N sucursales con radios independientes y vendedores que cubren 3+ zonas; la marcación debe advertir (no bloquear) si está fuera de sus zonas asignadas, permitir override de supervisor con motivo, y dejar auditoría de cada movimiento. Sin esto no hay control por sucursal ni asignación multi-zona.

## What Changes

- **BREAKING (model):** nueva colección `Branch{name, address, location{lat,lng}, geofenceRadius, geofenceType:'circle', company, isActive}` + `User.branches: ObjectId[]` (max 10) + `Location.locations[].geofenceResult` + `ControlTime.geofenceValidated`. `Company.location` se conserva como sede fallback y se migra a Branch "Sede principal".
- **API:** `GET/POST /api/branches`, `GET/PUT/DELETE /api/branches/:id` (edit `business_owner|supervisor|superuser|platform_admin`, view `+admin|hr_manager`, límite 20/eco) con Zod y `reason` obligatorio al mover geocerca; `PUT /api/employees/:id/branches` (misma matriz) con audit.
- **Geocerca:** `POST /api/locations` pasa de `403` a `warning` + `geofenceResult{inside,distance,branchId,branchName,overriddenBy,overrideReason}` evaluado contra branches del empleado (o todas si no tiene, o `Company.location` si no hay branches). `override:true` solo para roles editores.
- **Flutter Empresa:** `CompanySettingsScreen` → lista + mapa (`flutter_map` OSM) con buscador Nominatim, botón "mi ubicación" (`geolocator`), pin arrastrable, slider radio, confirmación y motivo, delete soft, auditoría via `GET /api/audit-logs?entityType=Branch`.
- **Flutter Empleados:** `EmployeeTable` añade botón Zonas con `BranchAssignmentDialog` (FilterChip multi-select, max 10) que consume `PUT /employees/:id/branches`.
- **Infra:** `geocoding` centralizado con cache 5 min + throttle 1 req/s (server `src/utils/geocoding.ts`, app `GeocodingService`).

## Capabilities

### New Capabilities
- `branch-management`: CRUD de sucursales por empresa con auditoría y límite.
- `geofence-validation`: validación branch-aware con warning/override y fallback.
- `zone-assignment`: asignación multi-zona empleado ↔ branches.

### Modified Capabilities
- `company-settings`: de 1 geocerca global a N sucursales.
- `time-tracking`: marcación registra `geofenceResult` en vez de bloquear.

## Impact

- **Server** `src/db/models/branch`, `user`, `locations`, `timeControl`, `src/types/models.d.ts`, `src/utils/geofence`, `src/utils/geocoding`, `src/controllers/branchesController`, `employeeBranchesController`, `locationController`, `src/repositories/locationRepository`, `timeControlRepository`, `src/routes/branches`, `employees`, `src/schemas/branch`, `scripts/migrate-company-location-to-branch.ts`.
- **App** `data/models/branch_model`, `data/datasources/branch_remote_source`, `data/repositories/branch_*`, `core/services/geocoding_service`, `features/companies/screens/company_settings_screen`, `features/companies/providers/branch_provider`, `features/home/screens/home_screen` (override), `domain/employee/entities/employee_model`, `presentation/desktop/widgets/employee_table`, `branch_assignment_dialog`.
- **DB** nueva colección `branches`, índices `{company,name} unique`, `{company,location}` opcional.
- **API** nuevos endpoints y cambio de contrato `POST /locations` (de 403 a 200+warning).
