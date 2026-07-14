## ADDED Requirements

### Requirement: Unit tests for services
Each service SHALL have unit tests covering its core business logic, with repositories mocked.

#### Scenario: EmployeeService.create validates data
- **WHEN** `EmployeeService.create()` is called with valid employee data
- **THEN** the service SHALL call `repository.createEmployee()` with the correct arguments

#### Scenario: WorkOrderService rejects invalid status transition
- **WHEN** `WorkOrderService.complete()` is called on a work order with status `completado`
- **THEN** the service SHALL throw an error

#### Scenario: AuthService rejects invalid credentials
- **WHEN** login is attempted with incorrect password
- **THEN** the service SHALL return 401

### Requirement: Integration tests for critical endpoints
Critical API endpoints SHALL have integration tests using a test database.

#### Scenario: Auth register creates employee in DB
- **WHEN** `POST /api/auth/register` is called with valid data
- **THEN** the employee SHALL be persisted in the test database

#### Scenario: Auth login returns tokens
- **WHEN** `POST /api/auth/login` is called with valid credentials
- **THEN** the response SHALL contain both `token` and `refreshToken` fields

#### Scenario: WorkOrder full lifecycle
- **WHEN** a work order is created, then started, then completed
- **THEN** each status transition SHALL succeed and the final status SHALL be `completado`

#### Scenario: Protected endpoint rejects unauthenticated requests
- **WHEN** a request is made to a protected endpoint without a token
- **THEN** the system SHALL return 401

### Requirement: Test infrastructure
The test suite SHALL have proper infrastructure for isolated testing.

#### Scenario: Tests use in-memory MongoDB
- **WHEN** integration tests run
- **THEN** they SHALL use `mongodb-memory-server` to avoid depending on a real database

#### Scenario: Tests clean up between suites
- **WHEN** each test suite completes
- **THEN** the test database SHALL be cleared to prevent test pollution
