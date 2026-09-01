# Geofence Validation Specification

## Purpose
TBD - created by archiving change geo-sucursales-multizona. Update Purpose after archive.

## Requirements

### Requirement: Branch-aware warning (no block) for attendance
The system SHALL evaluate `POST /api/locations {locationTimeData {location{lat,lng}}}` against branches assigned to the employee (or all company branches if none assigned, or `Company.location` fallback) and return 200 with `warning` when outside, never 403, persisting `geofenceResult` on both `Location` and `TimeControl`.

#### Scenario: Inside assigned zone
- **WHEN** employee assigned to Branch A marks inside its radius
- **THEN** response has no `warning`, `geofenceResult.inside=true`, `locations[].geofenceResult.inside=true`, `timeControls.geofenceValidated.inside=true`.

#### Scenario: Outside assigned zone
- **WHEN** employee marks outside all assigned zones
- **THEN** response returns 200 `message: "Registro exitoso con advertencia: Fuera del área permitida (Xm, sucursal Y)"`, `warning` defined, `geofenceResult.inside=false`, persisted in both collections.

#### Scenario: Fallback to company
- **WHEN** company has 0 branches but has `Company.location`
- **THEN** validation uses `Company.location` as candidate.

#### Scenario: No geofence at all
- **WHEN** company has 0 branches and no `Company.location`
- **THEN** validation returns `inside:true` (open).

### Requirement: Supervisor override
The system SHALL allow `supervisor`, `business_owner`, `superuser`, `platform_admin` to send `override:true, overrideReason:string` to suppress `warning` and record `geofenceResult.overriddenBy` and `overrideReason`.

#### Scenario: Override succeeds
- **WHEN** supervisor posts `locationTimeData {override:true, overrideReason:'visita cliente'}` outside zone
- **THEN** response has no `warning`, stored `geofenceResult.overriddenBy=supervisorId, overrideReason='visita cliente'`.

#### Scenario: Employee override ignored
- **WHEN** `employee` sends `override:true`
- **THEN** system ignores override and still returns `warning` with `inside=false`.

### Requirement: Tenant-isolated geofence evaluation
The system SHALL reject `POST /api/locations` if `locationTimeData.employee` does not belong to `context.companyId`.

#### Scenario: Cross-tenant spoof
- **WHEN** company A posts location with `employee` from company B
- **THEN** system returns 404 `Empleado no encontrado en esta empresa`.
