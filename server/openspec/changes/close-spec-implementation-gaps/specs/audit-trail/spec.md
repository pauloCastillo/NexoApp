## ADDED Requirements

### Requirement: Audit log creation
The system SHALL create an immutable audit log entry for every critical operation. Audit logs SHALL be append-only — never updated or deleted.

#### Scenario: Employee creation generates audit event
- **WHEN** a new employee is created via `POST /api/employees`
- **THEN** the system SHALL create an AuditLog entry with action `employee.created`, entityType `Employee`, entityId, userId, companyId, and timestamp

#### Scenario: Attendance punch generates audit event
- **WHEN** an employee registers entrada/descanso/retorno/salida
- **THEN** the system SHALL create an AuditLog entry with action `attendance.punch`, entityType `TimeControl`, entityId, and timestamp

#### Scenario: WorkOrder status transition generates audit event
- **WHEN** a work order status changes
- **THEN** the system SHALL create an AuditLog entry with action `workorder.status_changed`, previousValue, newValue, and userId

#### Scenario: Login attempt generates audit event
- **WHEN** a user logs in successfully
- **THEN** the system SHALL create an AuditLog entry with action `auth.login` and ipAddress

#### Scenario: Failed login generates audit event
- **WHEN** a login attempt fails
- **THEN** the system SHALL create an AuditLog entry with action `auth.login_failed` and ipAddress

### Requirement: Audit log query
The system SHALL expose audit logs to authorized users via API.

#### Scenario: Superuser queries audit logs
- **WHEN** a superuser requests `GET /api/audit-logs?companyId=X`
- **THEN** the system SHALL return audit logs filtered by companyId

#### Scenario: Non-superuser cannot query other tenant logs
- **WHEN** a non-superuser requests audit logs for a different company
- **THEN** the system SHALL return 403 Forbidden

### Requirement: Audit log immutability
Audit logs SHALL NOT be modifiable or deletable through any API.

#### Scenario: Delete audit log returns 405
- **WHEN** a request is made to `DELETE /api/audit-logs/:id`
- **THEN** the system SHALL return 405 Method Not Allowed

#### Scenario: Update audit log returns 405
- **WHEN** a request is made to `PATCH /api/audit-logs/:id`
- **THEN** the system SHALL return 405 Method Not Allowed
