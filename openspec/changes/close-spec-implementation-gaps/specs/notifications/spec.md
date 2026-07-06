## ADDED Requirements

### Requirement: Real-time notification delivery
The system SHALL deliver notifications to employees in real-time via Socket.io when specific events occur.

#### Scenario: WorkOrder created sends notification
- **WHEN** a work order is created
- **THEN** the system SHALL emit a `notification` event to the Socket.io room for the employee's company with type `work_order.created`, title, and workOrder data

#### Scenario: Vacation status changed sends notification
- **WHEN** a vacation request status changes (approved/rejected)
- **THEN** the system SHALL emit a `notification` event to the Socket.io room for the affected employee with type `vacation.status_changed`

#### Scenario: Permission status changed sends notification
- **WHEN** a permission request status changes
- **THEN** the system SHALL emit a `notification` event to the affected employee with type `permission.status_changed`

### Requirement: Notification persistence
The system SHALL persist notifications in the database for historical retrieval.

#### Scenario: Notification is stored on creation
- **WHEN** a notification event is triggered
- **THEN** the system SHALL create a Notification document with employee, company, type, title, message, data, and read=false

### Requirement: Notification API
The system SHALL expose REST endpoints for notification management.

#### Scenario: Employee retrieves notifications
- **WHEN** an employee requests `GET /api/notifications`
- **THEN** the system SHALL return the employee's notifications ordered by createdAt desc

#### Scenario: Employee marks notification as read
- **WHEN** an employee requests `PATCH /api/notifications/:id/read`
- **THEN** the system SHALL mark the notification as read=true

### Requirement: Socket.io connection authentication
The system SHALL authenticate Socket.io connections using JWT.

#### Scenario: Unauthenticated socket connection is rejected
- **WHEN** a Socket.io connection attempt is made without a valid token
- **THEN** the system SHALL emit an `error` event and disconnect the socket

#### Scenario: Authenticated socket joins company room
- **WHEN** a Socket.io connection succeeds with a valid token
- **THEN** the system SHALL join the socket to a room identified by the user's companyId
