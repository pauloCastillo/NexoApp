# Request Queue Specification

## Purpose
TBD - created by syncing change split-mobile-layouts. Update Purpose after archive.

## Requirements

### Requirement: Unified admin request queue
The system SHALL provide an admin queue at `GET /admin/requests` (Flutter route) backed by `GET /api/permissions?status=&type=` and `GET /api/vacations?status=` with tabs `Pendientes | Aprobadas | Rechazadas` and detail `admin/requests/:id`.

#### Scenario: Admin sees pending
- **WHEN** an `hr_manager` opens `admin/requests` with tab Pendientes
- **THEN** the list SHALL contain permissions and vacations with `status=pendiente` for its company (supervisor filtered to own department)

#### Scenario: Deep link to detail
- **WHEN** a push notification with `requestId` is tapped
- **THEN** the app SHALL navigate to `admin/requests/:id` and display approve/reject actions

### Requirement: Department-scoped approval for supervisor
Supervisors SHALL only approve/reject requests where the target employee belongs to the same `department` as the supervisor.

#### Scenario: Supervisor approval allowed
- **WHEN** a `supervisor` of department X approves a permission for an employee in department X
- **THEN** the server SHALL update status to `aprobado` and emit audit log

#### Scenario: Supervisor approval blocked cross-department
- **WHEN** a `supervisor` of department X tries to approve a request for department Y
- **THEN** the server SHALL return 403 with "Fuera de tu departamento"

### Requirement: HR/Business owner approval scope
Only `hr_manager` and `business_owner` SHALL be able to approve/reject vacations and permissions (any department within their company).

#### Scenario: HR approves vacation
- **WHEN** an `hr_manager` calls `PUT /api/vacations/:id` with `status=aprobado`
- **THEN** the status SHALL become `aprobado`

### Requirement: Employee unified requests entry
Employees SHALL see a single entry `Mis Solicitudes` with two cards `Vacaciones` and `Licencias & Permisos` leading to respective forms that create `vacation` or `permission` documents.

#### Scenario: Employee creates vacation
- **WHEN** employee submits vacation with `startDate` and `endDate`
- **THEN** a `vacation` with `status=pendiente` SHALL be created

### Requirement: Medical certificate attachment for licencia
When `permission.type == licencia`, the system SHALL accept an optional `attachmentUrl` (PDF/JPG/PNG, max 5MB) as proof; the server SHALL validate mime and persist the URL.

#### Scenario: Licencia with attachment
- **WHEN** employee creates a `licencia` with a PDF certificate
- **THEN** the request succeeds and `permission.attachmentUrl` is stored

#### Scenario: Approved request shows attachment
- **WHEN** admin opens a `licencia` detail that has an attachment
- **THEN** the UI SHALL display a preview/download link for the certificate

### Requirement: Work order transitions
Work order status transitions (`pendiente→en_progreso→completado|cancelado`) SHALL be allowed to `supervisor` (own department) and `business_owner` (any), with `business_owner` additionally allowed to edit metadata.

#### Scenario: Supervisor starts order
- **WHEN** a `supervisor` calls `PATCH /api/work-orders/:id/start` for an order in its department
- **THEN** status SHALL become `en_progreso`
