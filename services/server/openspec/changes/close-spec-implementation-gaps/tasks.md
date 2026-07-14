## 1. Audit Trail

- [ ] 1.1 Create AuditLog Mongoose model (append-only, fields: action, entityType, entityId, userId, companyId, previousValue, newValue, ipAddress, metadata)
- [ ] 1.2 Create AuditLogService with `log()` and `query()` methods
- [ ] 1.3 Create audit routes (GET list with company filter, DELETE/PATCH return 405)
- [ ] 1.4 Wire audit logging into EmployeeService (create, update, delete)
- [ ] 1.5 Wire audit logging into TimeControlService (punch events)
- [ ] 1.6 Wire audit logging into AuthService (login, login_failed)
- [ ] 1.7 Wire audit logging into WorkOrderService (status transitions)
- [ ] 1.8 Wire audit logging into PermissionService (status changes)
- [ ] 1.9 Wire audit logging into VacationService (status changes)

## 2. Notifications

- [ ] 2.1 Create Notification Mongoose model (employee, company, type, title, message, data, read, createdAt)
- [ ] 2.2 Create NotificationService with create/notify methods + Socket.io event emission
- [ ] 2.3 Create notification routes (GET list, PATCH read)
- [ ] 2.4 Wire Socket.io authentication middleware (JWT verify, join company room)
- [ ] 2.5 Wire notifications into WorkOrderService (creation, status changes)
- [ ] 2.6 Wire notifications into PermissionService (status changes)
- [ ] 2.7 Wire notifications into VacationService (status changes)

## 3. API Security

- [ ] 3.1 Add `express-rate-limit` and `helmet` to package.json
- [ ] 3.2 Configure helmet globally in Express setup
- [ ] 3.3 Configure rate limiter (100 req/min general, 20 req/min for /auth/login)
- [ ] 3.4 Disable rate limiting when DEV_STATUS=development
- [ ] 3.5 Add `pino.stdTimeFunctions.isoTime` to logger config
- [ ] 3.6 Add `redact` option to Pino logger (password, token, authorization, secret)

## 4. Refresh Token Rotation

- [ ] 4.1 Add `refreshTokenHash` field to Employee/User Mongoose model
- [ ] 4.2 Modify `signRefreshToken` to store bcrypt hash in user document
- [ ] 4.3 Modify refresh endpoint to verify hash, rotate token, update hash
- [ ] 4.4 Add reuse detection (hash mismatch → clear stored hash → force re-login)

## 5. WorkOrder Status

- [ ] 5.1 Add `status` field to WorkOrder schema (enum: pendiente/en_progreso/completado/cancelado)
- [ ] 5.2 Add `completedAt`, `cancelledAt`, `cancellationReason` fields to WorkOrder schema
- [ ] 5.3 Add status transition methods to WorkOrder model or service
- [ ] 5.4 Create status transition routes (PATCH start, complete, cancel)
- [ ] 5.5 Add status transition validation (reject invalid transitions with 400)

## 6. Zod Validation Connected

- [ ] 6.1 Wire `validate()` middleware to auth routes (register, login)
- [ ] 6.2 Wire `validate()` middleware to employee routes (create, update)
- [ ] 6.3 Wire `validate()` middleware to client routes (create, update)
- [ ] 6.4 Wire `validate()` middleware to company routes (create, update)
- [ ] 6.5 Wire `validate()` middleware to work order routes (create, update)
- [ ] 6.6 Wire `validate()` middleware to permission routes (create, update)
- [ ] 6.7 Wire `validate()` middleware to vacation routes (create, update)
- [ ] 6.8 Ensure validation error format matches spec (field + message array)

## 7. API Completeness

- [ ] 7.1 Implement `requireRole(...roles)` middleware factory
- [ ] 7.2 Refactor `requireSuperuser` to delegate to `requireRole`
- [ ] 7.3 Implement `PUT /api/employees/:id` in employee routes
- [ ] 7.4 Implement `PUT /api/clients/:id` in client routes
- [ ] 7.5 Implement `DELETE /api/clients/:id` in client routes
- [ ] 7.6 Implement `PUT /api/permissions/:id` in permission routes
- [ ] 7.7 Implement `DELETE /api/permissions/:id` in permission routes
- [ ] 7.8 Implement `PUT /api/vacations/:id` in vacation routes
- [ ] 7.9 Implement `DELETE /api/vacations/:id` in vacation routes
- [ ] 7.10 Implement `PUT /api/work-orders/:id` in work order routes
- [ ] 7.11 Implement `DELETE /api/work-orders/:id` in work order routes

## 8. UTC Timestamps

- [ ] 8.1 Change `date` default in TimeControl model from `moment.tz(...)` to `() => new Date()`
- [ ] 8.2 Change `date` default in WorkOrder model from `moment.tz(...)` to `() => new Date()`
- [ ] 8.3 Change `date` default in Location model from `moment.tz(...)` to `() => new Date()`
- [ ] 8.4 Audit any other model schemas for America/La_Paz timestamp overrides

## 9. Business Tests

- [ ] 9.1 Install test dependencies (mongodb-memory-server, supertest)
- [ ] 9.2 Create test helper for in-memory MongoDB connection
- [ ] 9.3 Write AuthService unit tests (register, login, refresh)
- [ ] 9.4 Write EmployeeService unit tests (create, update)
- [ ] 9.5 Write WorkOrderService unit tests (status transitions)
- [ ] 9.6 Write integration test for auth endpoints
- [ ] 9.7 Write integration test for employee CRUD
- [ ] 9.8 Write integration test for work order lifecycle
