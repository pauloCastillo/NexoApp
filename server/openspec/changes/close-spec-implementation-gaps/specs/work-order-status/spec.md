## ADDED Requirements

### Requirement: WorkOrder status lifecycle
Work orders SHALL have a defined status lifecycle with valid transitions.

#### Scenario: WorkOrder created with pending status
- **WHEN** a work order is created
- **THEN** its status SHALL be `pendiente`

#### Scenario: WorkOrder transitions to in_progress
- **WHEN** a work order with status `pendiente` is started
- **THEN** its status SHALL change to `en_progreso`

#### Scenario: WorkOrder transitions to completed
- **WHEN** a work order with status `en_progreso` is completed
- **THEN** its status SHALL change to `completado` and `completedAt` SHALL be set to the current UTC timestamp

#### Scenario: WorkOrder transitions to cancelled
- **WHEN** a work order with status `pendiente` or `en_progreso` is cancelled
- **THEN** its status SHALL change to `cancelado`, `cancelledAt` SHALL be set, and `cancellationReason` SHALL be recorded

#### Scenario: Invalid transition is rejected
- **WHEN** an attempt is made to transition from `completado` back to `en_progreso`
- **THEN** the system SHALL reject with 400 Bad Request

### Requirement: WorkOrder status API endpoints
The system SHALL expose endpoints for status transitions.

#### Scenario: Start work order
- **WHEN** a request is made to `PATCH /api/work-orders/:id/start`
- **THEN** the system SHALL transition the work order to `en_progreso`

#### Scenario: Complete work order
- **WHEN** a request is made to `PATCH /api/work-orders/:id/complete`
- **THEN** the system SHALL transition the work order to `completado`

#### Scenario: Cancel work order
- **WHEN** a request is made to `PATCH /api/work-orders/:id/cancel` with a reason
- **THEN** the system SHALL transition the work order to `cancelado`

### Requirement: Status change audit
Every work order status transition SHALL generate an audit event.

#### Scenario: Status change is audited
- **WHEN** a work order status changes
- **THEN** the system SHALL create an AuditLog entry with action `workorder.status_changed`, previousValue, newValue, userId, and companyId
