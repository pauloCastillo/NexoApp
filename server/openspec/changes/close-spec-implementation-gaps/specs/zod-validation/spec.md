## ADDED Requirements

### Requirement: Request body validation
All API endpoints SHALL validate request bodies using Zod schemas before reaching controllers.

#### Scenario: Register validates required fields
- **WHEN** a POST request is made to `/api/auth/register` with missing required fields
- **THEN** the system SHALL return 400 Bad Request with a validation error detailing which fields are missing

#### Scenario: Login validates email format
- **WHEN** a POST request is made to `/api/auth/login` with an invalid email format
- **THEN** the system SHALL return 400 Bad Request with a validation error for the email field

#### Scenario: Create employee validates password match
- **WHEN** a POST request is made to `/api/employees` where password and confirmPassword do not match
- **THEN** the system SHALL return 400 Bad Request with a validation error

#### Scenario: Create client validates company name
- **WHEN** a POST request is made to `/api/clients` with an empty companyName
- **THEN** the system SHALL return 400 Bad Request with a validation error

### Requirement: Validation error format
All validation errors SHALL follow a consistent format.

#### Scenario: Validation error response structure
- **WHEN** validation fails
- **THEN** the response SHALL contain `{ message: "Datos inválidos", errors: [{ field: "...", message: "..." }] }`

### Requirement: Existing schemas connected
The existing Zod schemas (auth, employee, client, company) SHALL be connected to their respective routes.

#### Scenario: All POST/PATCH routes have validation
- **WHEN** any POST or PATCH endpoint receives a request
- **THEN** the Zod schema for that endpoint SHALL be applied via the validate() middleware before the controller handler
