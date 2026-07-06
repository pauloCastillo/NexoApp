## Context

Nexo es una plataforma Express 5 + MongoDB con arquitectura Routes → Controllers → Services → Repositories → Models. Las especificaciones fundacionales definen requisitos que no fueron implementados. Este diseño cubre 9 capacidades transversales que cierran esas brechas. Ninguna requiere cambios arquitectónicos mayores — todas son adiciones localizadas o extensiones de patrones existentes.

## Goals / Non-Goals

**Goals:**
- Cerrar TODAS las brechas identificadas entre specs y código
- Mantener compatibilidad backward con APIs existentes
- Migración de datos existentes sin downtime (cuando aplique)
- Tests que validen cada nueva capacidad

**Non-Goals:**
- Refactorizar la arquitectura existente (Routes → Controllers → Services → Repos)
- Cambiar el stack tecnológico
- Agregar funcionalidades no especificadas en las specs fundacionales

## Decisions

### 1. Audit Trail

```
Estrategia: Modelo dedicado + repositorio + integración vía eventos
```

- **Modelo `AuditLog`**: `{ timestamp, userId, companyId, action, entityType, entityId, previousValue, newValue, ipAddress }`
- **Integración**: Los servicios existentes emiten logs de auditoría después de operaciones exitosas. No se requiere refactor masivo — se agrega una línea por operación crítica.
- **Append-only**: El repositorio de AuditLog solo expone `create()` y `find()`; nunca `update()` ni `delete()`.
- **Eventos auditables** (según security.md):
  - Auth: login, logout, failed login attempts
  - CRUD: creación/modificación/eliminación de employees, clients, workOrders
  - WorkOrder: transiciones de estado
  - Attendance: marcaje (entrada, salida, descanso)
  - Permisos: cambios de roles
- **Cache en memoria**: Opcional. Para evitar impacto en escritura, se puede implementar batch async insert. Fase inicial: sincrónico.

### 2. Notifications

```
Estrategia: Modelo Notification + Socket.io rooms por tenant + servicio unificado
```

- **Modelo `Notification`**: `{ employee, company, type, title, message, data, read, createdAt }`
- **Socket.io**: Namespace `/api/notifications` con rooms por `companyId`. Cada empleado se suscribe a su room al conectar.
- **Servicio `NotificationService`**: Crea la notificación en DB + emite vía socket al room correspondiente.
- **Tipos de eventos iniciales**: `work_order.created`, `work_order.updated`, `vacation.status_changed`, `permission.status_changed`, `attendance.anomaly`
- **REST endpoint**: `GET /api/notifications?employee_id=X` para recuperar historial; `PATCH /api/notifications/:id/read` para marcar como leída.

### 3. API Security

```
Estrategia: Middleware global + configuración declarativa
```

- **Rate limiting**: `express-rate-limit` con límites por IP para auth endpoints (20 req/min en login) y general (100 req/min). Configurable por ruta.
- **Security headers**: `helmet` middleware global. Incluye HSTS, X-Content-Type-Options, X-Frame-Options, CSP básico.
- **Pino redact**: Agregar opción `redact: ['password', 'token', 'secret', 'authorization', 'confirmPassword']` al logger.
- **CORS**: Ya configurado en main.ts. Extender para reflejar whitelist si es necesario.

### 4. Refresh Token Rotation

```
Estrategia: Almacenar hash del refresh token en el documento del usuario
```

- Agregar campo `refreshTokenHash: String` a los modelos Employee y Manager.
- **Flujo**:
  1. Login: generar refresh token + almacenar `bcrypt(refreshToken)` en el usuario
  2. Refresh: verificar que `bcrypt(refreshToken)` coincida con el hash almacenado
  3. Si coincide: generar nuevo par, actualizar hash, retornar nuevos tokens
  4. Si NO coincide (reuso de token antiguo): rechazar + opcionalmente marcar sesión como comprometida
- Alternativa considerada: collection separada `refreshTokens`. Descartada por simplicidad — el hash en el user document es suficiente para el volumen actual.

### 5. WorkOrder Status

```
Estrategia: Agregar campo status + timestamps al modelo existente
```

- **Nuevos campos en WorkOrder**:
  - `status`: enum `pendiente | en_progreso | completado | cancelado` (default: `pendiente`)
  - `completedAt`: Date (optional)
  - `cancelledAt`: Date (optional)
  - `cancellationReason`: String (optional)
- **Métodos en WorkOrderService**: `assign()`, `start()`, `complete()`, `cancel()`
- Cada transición emite evento de auditoría
- Transiciones válidas: `pendiente → en_progreso → completado`, `pendiente → cancelado`, `en_progreso → cancelado`

### 6. Zod Validation

```
Estrategia: Conectar middleware validate() existente a las rutas
```

- Las rutas `auth.ts` y `employees.ts` ya importan schemas. Agregar `validate(schema)` en la middleware chain.
- `registerSchema` requiere validación extra de `confirmPassword` — se agrega `.refine()` al schema.
- Las rutas que no tienen schema (locations, workOrders, permissions, vacations) reciben schemas nuevos.
- El middleware `validate()` ya existe en `src/middlewares/validate.ts` — solo falta conectarlo.

### 7. API Completeness

```
Estrategia: Endpoints REST faltantes + middleware genérico requireRole()
```

- **Endpoints a agregar**:
  - `PUT /api/employees/:id` — updateEmployee
  - `PUT /api/clients/:id` — updateClient + `DELETE /api/clients/:id` — deleteClient
  - `PUT /api/permissions/:id` — updatePermission (status) + `DELETE /api/permissions/:id`
  - `PUT /api/vacations/:id` — updateVacation (status) + `DELETE /api/vacations/:id`
  - `PUT /api/work-orders/:id` — updateWorkOrder + `DELETE /api/work-orders/:id`
- **Middleware `requireRole(...roles: string[])`**: Middleware factory que verifica que `req.userRole` esté en la lista. Reemplaza `requireSuperuser` donde sea posible (backward compat).

### 8. UTC Timestamps

```
Estrategia: Cambiar default de modelos + limpiar servicios
```

- timeControl.ts: `default: () => new Date()` (MongoDB almacena UTC por defecto)
- workOrder.ts: mismo cambio
- locations.ts: mismo cambio
- Servicios/controladores que usan `DateTime.now().setZone("America/La_Paz")`: cambiar a `DateTime.now().toUTC()` o `new Date()`
- Los campos `timestamps: true` de Mongoose ya generan UTC. Sin cambios ahí.

### 9. Business Tests

```
Estrategia: Jest + MongoDB Memory Server para integración; unit tests con mocks
```

- **Unit tests**: Testear EmployeeService, WorkOrderService, PermissionService, VacationService con repositorios mockeados
- **Integration tests**: Auth (register, login, refresh), Attendance (time control lifecycle), WorkOrder (CRUD + status transitions)
- **Herramientas**: `mongodb-memory-server` para BD en memoria, `supertest` para HTTP
- **Objetivo**: >60% coverage en código nuevo, >10% en general

## Riesgos / Trade-offs

- [Audit Trail sincrónico] → Impacto en latencia de escritura. Si es problema, migrar a cola asíncrona.
- [Hash de refresh token en user document] → Lectura adicional en cada refresh. Para <100k usuarios, irrelevante.
- [UTC timestamps en data existente] → Los datos en MongoDB ya están en UTC internamente. Solo cambia la generación de nuevos registros.
- [WorkOrder status en data existente] → Los documentos sin status reciben `pendiente` como default. Migración automática.
- [Rate limiting en auth] → Podría afectar pruebas manuales. Configurable vía env var en desarrollo.

## Open Questions

- ¿Se requiere notificación push (Expo Push Notifications) además de Socket.io? El spec menciona "push" pero no hay infraestructura Expo configurada. Fase inicial: solo socket + in-app.
- ¿Los reportes deben exponerse como API descargable en lugar de escribir a archivo local? El spec dice "Integraciones exclusivamente por API". Pendiente para cambio separado.
