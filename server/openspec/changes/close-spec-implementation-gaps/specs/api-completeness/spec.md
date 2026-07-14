## ADDED Requirements

### Requirement: Employee update endpoint
The system SHALL expose `PUT /api/employees/:id` for updating employee data.

#### Scenario: Employee is updated successfully
- **WHEN** a PUT request is made to `/api/employees/:id` with valid employee data
- **THEN** the system SHALL update the employee and return the updated document

### Requirement: Client CRUD completeness
The system SHALL expose `PUT /api/clients/:id` and `DELETE /api/clients/:id`.

#### Scenario: Client is updated
- **WHEN** a PUT request is made to `/api/clients/:id` with valid data
- **THEN** the system SHALL update the client and return the updated document

#### Scenario: Client is deleted
- **WHEN** a DELETE request is made to `/api/clients/:id`
- **THEN** the system SHALL soft-delete or remove the client

### Requirement: Permission CRUD completeness
The system SHALL expose `PUT /api/permissions/:id` and `DELETE /api/permissions/:id`.

#### Scenario: Permission status is updated
- **WHEN** a PUT request is made to `/api/permissions/:id` with a new status
- **THEN** the system SHALL update the permission status and return the updated document

#### Scenario: Permission is deleted
- **WHEN** a DELETE request is made to `/api/permissions/:id`
- **THEN** the system SHALL delete the permission

### Requirement: Vacation CRUD completeness
The system SHALL expose `PUT /api/vacations/:id` and `DELETE /api/vacations/:id`.

#### Scenario: Vacation status is updated
- **WHEN** a PUT request is made to `/api/vacations/:id` with a new status
- **THEN** the system SHALL update the vacation status and return the updated document

### Requirement: WorkOrder CRUD completeness
The system SHALL expose `PUT /api/work-orders/:id` and `DELETE /api/work-orders/:id`.

#### Scenario: WorkOrder is updated
- **WHEN** a PUT request is made to `/api/work-orders/:id` with valid data
- **THEN** the system SHALL update the work order and return the updated document

### Requirement: requireRole middleware
The system SHALL provide a generic `requireRole(...roles)` middleware factory for role-based access control.

#### Scenario: Middleware allows authorized role
- **WHEN** a request is made to a route protected by `requireRole('manager', 'editor')` and the user has role `manager`
- **THEN** the request SHALL proceed to the next middleware

#### Scenario: Middleware blocks unauthorized role
- **WHEN** a request is made to a route protected by `requireRole('manager', 'editor')` and the user has role `employee`
- **THEN** the system SHALL return 403 Forbidden

#### Scenario: requireSuperuser replaced by requireRole
- **WHEN** `requireSuperuser` is used
- **THEN** it SHALL internally delegate to `requireRole('superuser')` for consistency
