## ADDED Requirements

### Requirement: Canonical role catalog
The system SHALL support exactly 8 roles: `superuser`, `platform_admin`, `support`, `business_owner`, `admin`, `supervisor`, `hr_manager`, `employee` with English codes and Spanish display names.

#### Scenario: Role persisted
- **WHEN** a user is created with `role=hr_manager`
- **THEN** the user document stores `role=hr_manager` and JWT contains `role=hr_manager`

#### Scenario: Legacy roles rejected
- **WHEN** a request tries to create a user with `role=viewer|editor|it`
- **THEN** validation SHALL reject with 400 and list valid roles

### Requirement: Role migration
The system SHALL provide an idempotent migration that maps `manager→supervisor`, `hr→hr_manager`, `editor→hr_manager`, `it→support`, `viewer→employee` and removes deprecated enum values.

#### Scenario: Migration run
- **WHEN** the migration script executes on a DB with legacy roles
- **THEN** all users are updated to the new enum and no document retains a deprecated role

### Requirement: Tenant and platform scope guards
The system SHALL enforce that `platform_admin`, `support`, `superuser` are platform scope (access cross-tenant only via explicit guards) and the remaining 5 roles are tenant scope (filtered by `company`).

#### Scenario: Tenant isolation
- **WHEN** an `employee` requests `GET /api/employees`
- **THEN** the response SHALL contain only users where `company == requester.company`

#### Scenario: Platform access
- **WHEN** a `superuser` requests `GET /api/companies`
- **THEN** the response SHALL contain companies across all tenants

### Requirement: Permission matrix by resource
The system SHALL enforce: vacation/permission approve only `hr_manager` or `business_owner`; work-order transitions only `supervisor` (own department) or `business_owner` (any); company geofence update only `business_owner`, `admin`, `platform_admin`.

#### Scenario: Forbidden approval
- **WHEN** a `supervisor` calls `PUT /api/vacations/:id` to approve
- **THEN** the server SHALL return 403

#### Scenario: Department-scoped supervisor check
- **WHEN** a `supervisor` of department A calls `PUT /api/permissions/:id` for a permission whose employee is in department B
- **THEN** the server SHALL return 403

#### Scenario: Geofence forbidden
- **WHEN** an `employee` calls `PUT /api/companies` to update geofence
- **THEN** the server SHALL return 403
