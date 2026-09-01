## ADDED Requirements

### Requirement: Branch CRUD per company
The system SHALL allow `business_owner`, `supervisor`, `superuser`, `platform_admin` to create/update/delete branches and `admin`, `hr_manager` to view, scoped by `company` from JWT.

#### Scenario: Create branch
- **WHEN** `POST /api/branches {name, location{lat,lng}, geofenceRadius, address?, reason?}` with editor role
- **THEN** system creates `Branch{company: JWT.company, name, location, geofenceRadius default 200, isActive:true}` and returns 201, logs `branch.create` with reason.

#### Scenario: Limit 20 branches
- **WHEN** company already has 20 active branches
- **THEN** `POST /api/branches` returns 400 `Límite de 20 sucursales alcanzado`.

#### Scenario: View forbidden
- **WHEN** `employee` calls `GET /api/branches`
- **THEN** system returns 403.

#### Scenario: Reason required on move
- **WHEN** `PUT /api/branches/:id {location}` without `reason`
- **THEN** system returns 400 `Motivo requerido al mover geocerca`.

#### Scenario: Cross-tenant isolation
- **WHEN** editor from company A calls `GET /api/branches/:id` of company B
- **THEN** system returns 403.

### Requirement: Branch model & migration
The system SHALL persist `Branch` with `{name, address?, location{lat,lng} required, geofenceRadius 50-2000, geofenceType:'circle', company, isActive, createdBy}` and unique index `{company, name}`. Migration script SHALL create Branch "Sede principal" from legacy `Company.location`.

#### Scenario: Migration
- **WHEN** `pnpm migrate:branches` runs on DB with `Company{location, geofenceRadius}`
- **THEN** each such company gets one `Branch{name:'Sede principal', location, geofenceRadius}` if not exists.

### Requirement: Audit for branch moves
The system SHALL log `branch.create|update|delete` to `auditLogs` with `previousValue/newValue` and `metadata.reason` for geofence moves.

#### Scenario: Audit on update
- **WHEN** `PUT /api/branches/:id` moves location with `reason: 'mudanza'`
- **THEN** `auditLogs` contains entry `action=branch.update, metadata.reason='mudanza'`.
