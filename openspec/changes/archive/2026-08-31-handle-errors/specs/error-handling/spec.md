## ADDED Requirements

### Requirement: Unified error contract
The system SHALL return errors as `{message, code, requestId, errors?}` where `message` is user-friendly Spanish (non-technical), `code` is a stable `UPPER_SNAKE` for Flutter/i18n, `requestId` is the correlation id, and `errors` is present only for 400 validation with `{field, message}` per field. Success responses SHALL preserve current shapes (`{users}`, `{clients}`, etc.) and add `x-request-id` header (and `requestId` in body when error).

#### Scenario: Validation error includes field errors
- **WHEN** client sends invalid `email` format
- **THEN** system responds 400 with `code: VALIDATION_ERROR`, `message: "Revisa los datos ingresados."`, `errors: [{field:"email", message:"Formato inválido"}]` and `requestId`

#### Scenario: Generic error is user-friendly
- **WHEN** any 500 occurs
- **THEN** system responds 500 with `message: "Ocurrió un inconveniente. Intenta de nuevo en unos segundos."`, `code: INTERNAL`, `requestId`, without `stack`

### Requirement: Friendly catalog
The system SHALL map every `code` to a non-technical Spanish message via `errorCatalog` and SHALL never expose raw `err.message`/`stack` in `message` in production.

#### Scenario: Duplicate key shows friendly message
- **WHEN** Mongoose 11000 duplicate on `email`
- **THEN** system responds 409 `code: DUPLICATE`, `message: "Ya existe un registro con esos datos."`

#### Scenario: Invalid id shows friendly message
- **WHEN** Mongoose `CastError` on ObjectId
- **THEN** system responds 400 `code: INVALID_ID`, `message: "El identificador no es válido."`

### Requirement: Mongoose error mapping
The system SHALL map Mongoose errors via repo proxy: `ValidationError→400 VALIDATION_ERROR`, `CastError→400 INVALID_ID`, `11000→409 DUPLICATE`, document not found→404 `NOT_FOUND`, connection/timeout→503 `DB_UNAVAILABLE` with friendly message; technical details SHALL be logged with `requestId`.

#### Scenario: ValidationError mapped
- **WHEN** `User.create` fails `ValidationError` on `password`
- **THEN** system logs technical `err.errors` with `requestId` and responds 400 `VALIDATION_ERROR` with field errors

### Requirement: Proxy coverage
The system SHALL intercept errors via JS Proxy at `ServiceFactory.getService()` + repository proxies + `proxyController` wrappers, so controllers SHALL NOT need per-handler try/catch; any throw SHALL be normalized to `AppError` and translated to HTTP response.

#### Scenario: Controller without try/catch still handled
- **WHEN** `getAllEmployees` service throws `NOT_FOUND`
- **THEN** system responds 404 `{message, code: NOT_FOUND, requestId}` via controller proxy

### Requirement: Request id correlation
The system SHALL generate or propagate `requestId` (`x-request-id` header or `crypto.randomUUID()`), set `req.id`, expose `x-request-id` response header, include `requestId` in error body, and log with `pino.child({requestId})`.

#### Scenario: Request id propagates
- **WHEN** client sends `x-request-id: abc`
- **THEN** system echoes `x-request-id: abc` and logs contain `requestId: abc`

### Requirement: Flutter Result
Flutter `core/network` and `data/datasources` SHALL return `Future<Result<T,Failure>>` (`sealed Result {Ok, Err}` + `Failure{message, code, status, requestId}`) instead of throwing raw `Exception`; `AuthInterceptor` SHALL NOT swallow errors with `catch(_){}` and SHALL map `DioException` to `Failure`.

#### Scenario: Datasource returns Err on invalid response
- **WHEN** `EmployeeRemoteSource.getAll()` receives unexpected JSON
- **THEN** it returns `Err(Failure(code: INVALID_RESPONSE, message: "No pudimos cargar empleados."))` not throw

### Requirement: Socket error contract
Socket namespace `setupEmployeeNamespace` SHALL emit errors as `{message, code, requestId}` with same catalog and SHALL set `socket.data.requestId`; auth failures and service errors SHALL be mapped to friendly messages.

#### Scenario: Socket auth fails
- **WHEN** socket connects without token
- **THEN** server emits `error` with `code: UNAUTHORIZED`, friendly `message`, `requestId`

### Requirement: Additive compatibility
Error responses SHALL be additive: existing clients reading only `message` SHALL continue to work; success shapes SHALL NOT be renamed; `code` and `requestId` SHALL be optional for old clients.

#### Scenario: Old client ignores code
- **WHEN** old Flutter client parses error `message` only
- **THEN** it still shows correct friendly message

### Requirement: Structured logging
The system SHALL log errors with `pino.error({requestId, code, statusCode, technical: err.message, stack})` on every normalized error; logs SHALL include `requestId` for correlation.

#### Scenario: Log contains correlation
- **WHEN** any error occurs
- **THEN** log entry contains `requestId` matching response header

### Requirement: Production no-leak
In production (`DEV_STATUS !== development`) the system SHALL NOT expose `stack` or raw `technical` in response body; in development it SHALL include `debug: {stack, technical}` under `debug` key without overwriting `message`.

#### Scenario: Prod hides stack
- **WHEN** 500 occurs in production
- **THEN** response has no `stack` or `debug` key

#### Scenario: Dev shows debug
- **WHEN** 500 occurs in development
- **THEN** response includes `debug: {stack, technical}` plus friendly `message`
