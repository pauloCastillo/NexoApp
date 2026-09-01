# Zone Assignment Specification

## Purpose
TBD - created by archiving change geo-sucursales-multizona. Update Purpose after archive.

## Requirements

### Requirement: Multi-zone assignment per employee
The system SHALL allow `business_owner`, `supervisor`, `superuser`, `platform_admin` to assign up to 10 branches to an employee via `PUT /api/employees/:id/branches {branchIds: string[], reason?}`. `User.branches` SHALL persist the list and be populated on fetch.

#### Scenario: Assign 3 zones
- **WHEN** supervisor `PUT /api/employees/:id/branches {branchIds: [b1,b2,b3]}` where all branches belong to same company
- **THEN** response returns `user.branches == [b1,b2,b3]` and logs `employee.branches.assigned`.

#### Scenario: Max 10
- **WHEN** `PUT /api/employees/:id/branches` with 11 ids
- **THEN** system returns 400 validation error.

#### Scenario: Invalid branch
- **WHEN** `branchIds` contains id not in `employee.company`
- **THEN** system returns 400 `Alguna sucursal no existe o no pertenece a la empresa`.

#### Scenario: Empty assignment
- **WHEN** `PUT /api/employees/:id/branches {branchIds: []}`
- **THEN** employee has no assigned zones and future attendance is validated against all company branches.

### Requirement: Flutter zone assignment UI
The app SHALL show a Zonas button on employee rows that opens `BranchAssignmentDialog` with `FilterChip` multi-select of all company branches, allowing save via `PUT /employees/:id/branches`.

#### Scenario: Dialog
- **WHEN** user taps Zonas on an employee
- **THEN** dialog loads `GET /api/branches` and shows chips pre-selected by `employee.branches`, allows toggle and save with success snackbar.
