## Why

El proyecto Nexo tiene especificaciones fundacionales aprobadas (overview, architecture, business-rules, security, development-workflow) que definen capacidades críticas como auditoría, notificaciones, rate limiting, seguridad, y trazabilidad. Sin embargo, una revisión sistemática reveló que múltiples capacidades especificadas no fueron implementadas o lo fueron parcialmente. Este cambio cierra todas las brechas identificadas para alinear el código con las specs.

## What Changes

1. **Audit Trail** — Sistema de logging inmutable append-only para todas las operaciones críticas (CRUD, auth, work orders, attendance)
2. **Notificaciones** — Sistema de notificaciones vía Socket.io con eventos, canales por empleado, y notificaciones in-app
3. **API Security** — Rate limiting por endpoint, headers de seguridad HTTP (helmet), redacción de secrets en Pino
4. **Refresh Token Rotation** — Invalidar refresh tokens al usarlos, prevenir reuso
5. **WorkOrder Status** — Agregar ciclo de vida con estados a las órdenes de trabajo
6. **Zod Validation** — Conectar schemas Zod existentes a las rutas API
7. **API Completeness** — Endpoints faltantes (PUT/DELETE) + middleware genérico requireRole()
8. **UTC Timestamps** — Reemplazar `America/La_Paz` por UTC en todos los modelos y servicios
9. **Business Tests** — Tests unitarios e integración para la lógica de negocio

## Capabilities

### New Capabilities
- `audit-trail`: Sistema de auditoría inmutable con eventos por operación crítica
- `notifications`: Sistema de notificaciones en tiempo real vía Socket.io
- `api-security`: Rate limiting, headers de seguridad (helmet), redacción de sensitive fields en logs
- `refresh-token-rotation`: Invalidación de refresh tokens al rotar, prevenir ataques de reuso
- `work-order-status`: Estados (pendiente, en_progreso, completado, cancelado) y ciclo de vida en órdenes de trabajo
- `zod-validation`: Middleware validate() aplicado a todas las rutas con schemas existentes
- `api-completeness`: PUT/DELETE endpoints faltantes + middleware requireRole()
- `utc-timestamps`: Estandarización de todos los timestamps del sistema a UTC
- `business-tests`: Cobertura de tests para lógica de negocio core

### Modified Capabilities
- *(ninguna — todas las capacidades son adiciones, no cambios a requirements existentes)*

## Impact

- **Modelos**: WorkOrder requiere nuevo campo `status` + enum; se agrega modelo `AuditLog`; se requiere migración de datos existentes
- **Rutas**: Se agregan nuevas rutas PUT/DELETE; se modifica middleware chain en rutas existentes para incluir validate()
- **Controladores**: Se agregan try/catch consistente en todos los handlers
- **Servicios/Repos**: Se agregan métodos faltantes; repositorios auditables emiten eventos
- **Dependencias**: `express-rate-limit`, `helmet` (nuevas); posibles dependencias de test
- **Socket.io**: Namespaces existentes se extienden para notificaciones
- **Timezone**: Cambio de `America/La_Paz` a UTC en timeControl, workOrder y location schemas
