## Context

`Company{location, geofenceRadius}` único, validación en `LocationRepository.createLocation` con `throw 403` y `CompanySettingsScreen` con 1 pin + slider. No existe `Branch`; `User` tiene `department` pero no `branches`. Marcación bloquea fuera de radio; no hay override ni auditoría de movimientos.

Stakeholders: `business_owner`/`supervisor` editan zonas, `admin`/`hr_manager` solo ven, empleados marcan y pueden ser asignados a múltiples zonas, auditores revisan logs.

## Goals / Non-Goals

**Goals:**
- N sucursales por empresa, cada una con geocerca circular y dirección.
- Asignación multi-zona (vendedor 3+ zonas, max 10).
- Warning (no bloqueo) + override supervisor con motivo, aplicado a `timeControls` y `locations`.
- Buscador dirección (Nominatim), "usar mi ubicación", pin arrastrable, reverse geocode, confirmación y motivo.
- Permisos `edit: business_owner|supervisor|superuser|platform_admin`, `view: +admin|hr_manager`, audit `branch.create|update|delete` + `employee.branches.assigned`.
- Preservar `Company.location` como sede y migrar.

**Non-Goals:**
- Polígono editable (solo `geofenceType:'circle'` reservado).
- Geocerca por turno/horario ni reportes por sucursal.
- Migración a Google/Mapbox (mantener OSM/flutter_map).

## Decisions

**D1 — Branch como colección (vs embebido en Company)**
Elegido colección `Branch` con `company` ref + índice único. Rationale: permite query por zona, índice 2dsphere futuro y no limita tamaño de `Company`. Embebido descartado por límite 16MB y queries.

**D2 — `User.branches: ObjectId[]` (vs colección intermedia)**
Array simple cubre 95% (vendedor 3-5 zonas). Join intermedio solo si se necesita historial/fechas. Límite 10 evita arrays gigantes.

**D3 — Círculo por sucursal**
`{lat,lng,radius}` con haversine O(1). Polígono requiere point-in-polygon y editor de vértices; se deja `geofenceType` para upgrade sin migración.

**D4 — Warning + override (vs 403)**
`evaluateGeofence` calcula distancia a branch más cercana (o fallback Company) y retorna `{inside,distance,branchId,branchName}`. `LocationRepository` no lanza 403; guarda `geofenceResult` y `TimeControl.geofenceValidated`. `locationController` retorna `warning` y `geofenceResult`. Override solo roles editores con `overrideReason`.

**D5 — Fallback chain**
Si `User.branches` no vacío → validar contra esas; si vacío → contra todas las branches activas de la company; si 0 branches → contra `Company.location`; si nada → `inside:true`. Evita romper empresas legacy.

**D6 — Mapas OSM**
Mantener `flutter_map` + OSM + Nominatim (gratis, ya en uso). Centralizar en `GeocodingService`/`src/utils/geocoding.ts` con cache 5 min + throttle 1 req/s. Google/Mapbox solo si dolor medido (abstracción en 1 archivo).

**D7 — Audit con `reason`**
`PUT /branches/:id` exige `reason` si mueve `location` o `geofenceRadius`. `auditLog` guarda `previousValue/newValue + metadata.reason`. Listado via `GET /audit-logs?entityType=Branch`.

## Risks / Trade-offs

- [Nominatim rate 1/s] → cache + throttle; fallback tap manual.
- [Offline marcación] → warning se recalcula en servidor al sync; client ya tiene cache+queue.
- [Duplicate coordinate suppress] → `existLocation` no inserta duplicado exacto pero inyecta `_injectedGeofenceResult` para no perder warning/override en TimeControl.
- [Cross-tenant spoof] → `User.findOne({_id, company})` en locationRepository mitiga.
- [20 branches limit] → evita abuso; configurable.

## Migration Plan

1. Deploy server: nuevos modelos + endpoints + `geofence` util; `Company.location` intacto.
2. Run `pnpm migrate:branches` → crea Branch "Sede principal" por empresa con location legacy.
3. Deploy app: nueva pantalla branches + diálogo zonas.
4. QA: CRUD perm matrix, multi-zona, warning/override inside/outside, fallback.
5. Rollback: borrar branches creados con `isActive=false`, código sigue leyendo `Company.location`.

## Open Questions

- ¿Límite 20/eco suficiente o sin límite?
- ¿Mostrar audit en UI separada vs dialog?
