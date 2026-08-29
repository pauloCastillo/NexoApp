# Estado del Sistema — NexoApp

## Arquitectura General

```
┌──────────────────────────────────────────────────────────────────┐
│                    NexoApp                                       │
│                                                                  │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐  │
│  │      Desktop (Flutter)       │  │    Mobile (Flutter)      │  │
│  │   Dueños / Gerentes          │  │   Empleados              │  │
│  │   flutter_map, Riverpod      │  │   geolocator, Riverpod   │  │
│  └──────────┬───────────────────┘  └──────────┬───────────────┘  │
│             │                                  │                  │
│             │      ┌──────────────────┐        │                  │
│             └──────┤  Express 5 API   ├────────┘                  │
│                    │  Socket.io       │                           │
│                    │  JWT Auth        │                           │
│                    └────────┬─────────┘                           │
│                             │                                     │
│                    ┌────────┴─────────┐                           │
│                    │   MongoDB Atlas  │                           │
│                    │   NexoDB         │                           │
│                    └──────────────────┘                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Mobile (Flutter)                             │    │
│  │              Empleados (alternativo)                      │    │
│  │              dart.io                                      │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend runtime | Node.js | ≥ 22.14.0 |
| Backend framework | Express | 5.2.1 |
| Backend lenguaje | TypeScript | 6.0.3 |
| Base de datos | MongoDB Atlas | — |
| ODM | Mongoose | 9.7.3 |
| Tiempo real | Socket.io | 4.8.3 |
| Auth | JWT + bcrypt | — |
| Validación | Zod | 4.4.3 |
| Logging | Pino | 10.3.1 |
| Desktop | Flutter 3.12 (Dart) | flutter_map, Riverpod |
| Mobile (Flutter) | Flutter 3.12 (Dart) | geolocator, Riverpod |
| Mobile (RN) | Expo 56 / RN 0.85 | Redux Toolkit, Axios |

## API — Endpoints

### Auth `/api/auth`
| Método | Ruta | Auth | Propósito |
|--------|------|:----:|-----------|
| POST | `/register` | — | Registro de usuario |
| POST | `/login` | — | Inicio de sesión |
| POST | `/refresh` | — | Refrescar JWT |
| POST | `/logout` | JWT | Cerrar sesión |
| PUT | `/password` | JWT | Cambiar contraseña |

### Employees `/api/employees`
| Método | Ruta | Auth | Propósito |
|--------|------|:----:|-----------|
| GET | `/` | JWT | Listar empleados |
| POST | `/` | JWT | Crear empleado |
| GET | `/:id` | JWT | Obtener empleado |
| PUT | `/:id` | JWT | Actualizar empleado |
| DELETE | `/:id` | JWT | Eliminar empleado |
| WS | Socket.io namespace | — | Tiempo real |

### Companies `/api/companies`
| Método | Ruta | Auth | Propósito |
|--------|------|:----:|-----------|
| GET | `/public` | — | Listar empresas públicas |
| GET | `/` | JWT | Listar empresas (superuser) |
| POST | `/` | JWT+SU | Crear empresa |
| GET | `/me` | JWT | Mi empresa |
| GET | `/:id` | JWT | Empresa por ID |
| PUT | `/` | JWT | Actualizar empresa |

### Locations `/api/locations`
| Método | Ruta | Auth | Propósito |
|--------|------|:----:|-----------|
| POST | `/` | JWT | Registrar marcaje + GPS |
| GET | `/:id` | JWT | Historial de ubicaciones |

### Clients `/api/clients`
| Método | Ruta | Auth | Propósito |
|--------|------|:----:|-----------|
| GET | `/` | JWT | Listar clientes |
| POST | `/` | JWT | Crear cliente |
| PUT | `/:id` | JWT | Actualizar cliente |
| DELETE | `/:id` | JWT | Eliminar cliente |

### Permissions `/api/permissions`
| Método | Ruta | Auth | Propósito |
|--------|------|:----:|-----------|
| GET | `/:employee_id` | JWT | Listar permisos |
| POST | `/` | JWT | Solicitar permiso |
| PUT | `/:id` | JWT | Aprobar/rechazar |
| DELETE | `/:id` | JWT | Eliminar |

### Vacations `/api/vacations`
| Método | Ruta | Auth | Propósito |
|--------|------|:----:|-----------|
| GET | `/:employee_id` | JWT | Listar vacaciones |
| POST | `/` | JWT | Solicitar vacación |
| PUT | `/:id` | JWT | Aprobar/rechazar |
| DELETE | `/:id` | JWT | Eliminar |

### Work Orders `/api/work-orders`
| Método | Ruta | Auth | Propósito |
|--------|------|:----:|-----------|
| GET | `/:employee_id` | JWT | Listar órdenes |
| POST | `/` | JWT | Crear orden |
| PUT | `/:id` | JWT | Actualizar |
| DELETE | `/:id` | JWT | Eliminar |
| PATCH | `/:id/start` | JWT | Iniciar |
| PATCH | `/:id/complete` | JWT | Completar |
| PATCH | `/:id/cancel` | JWT | Cancelar |

### Dashboard `/api/dashboard`
| Método | Ruta | Auth | Propósito |
|--------|------|:----:|-----------|
| GET | `/summary` | JWT | KPIs del dashboard |
| GET | `/attendance/today` | JWT | Asistencias del día |

### Otros
| Método | Ruta | Auth | Propósito |
|--------|------|:----:|-----------|
| POST | `/api/notifications/register-token` | JWT | Registrar push token |
| GET | `/api/audit-logs` | JWT | Logs de auditoría |
| GET | `/api/health` | — | Health check |
| WS | Socket.io `/api/dashboard` | — | Tiempo real dashboard |
| WS | Socket.io `/api/employees` | — | Tiempo real empleados |
| WS | Socket.io `/api/locations` | — | Tiempo real ubicaciones |

## Base de Datos — Colecciones

| Colección | Documentos clave | Tenant |
|-----------|------------------|:------:|
| `users` | username, email, role, company, department, jobTitle | ✅ |
| `companies` | name, location, geofenceRadius | — |
| `departments` | name, company | ✅ |
| `jobTitles` | employee, job_title, department, company | ✅ |
| `timeControls` | employee, company, date, entrada, descanso, retorno, salida, location | ✅ |
| `locations` | employee, company, locations[{date,lat,lng,street}] | ✅ |
| `clients` | companyName, company, contactName, email, phone | ✅ |
| `permissions` | employee, company, type, status, reason, dates | ✅ |
| `vacations` | employee, company, startDate, endDate, status | ✅ |
| `workOrders` | employee, company, client, description, status, dates | ✅ |
| `auditLogs` | action, entityType, entityId, userId, companyId | ✅ |
| `pushTokens` | userId, token, platform | ✅ |

## Funcionalidades Implementadas

### ✅ Autenticación y Roles
- JWT access token (24h) + refresh token (7d)
- Roles: superuser, business_owner, manager, editor, viewer, employee, it, hr
- RBAC en middleware (`verifyToken`, `tenantGuard`)
- Refresh automático con cola de reintentos en mobile (RN)

### ✅ Gestión de Empleados
- CRUD completo con registro por admin
- Perfil: nombre, email, teléfono, puesto, departamento
- Asignación de roles

### ✅ Control de Asistencia (Time Control)
- 4 tipos de marcaje: entrada, descanso, retorno, salida
- Captura de coordenadas GPS con cada marcaje
- **Geocerca**: validación por distancia haversine
- Geocodificación inversa (Nominatim) para dirección
- Registro diario por empleado
- Actualizaciones en tiempo real vía Socket.io

### ✅ Órdenes de Trabajo
- CRUD completo con ciclo de vida
- Estados: pendiente → en_progreso → completado / cancelado
- Asignación a cliente con ubicación geográfica
- Transiciones por endpoint dedicado

### ✅ Gestión de Clientes
- CRUD completo
- Creación desde mobile (empleados) y desktop (admins)
- Selector de clientes para órdenes de trabajo

### ✅ Permisos y Vacaciones
- Solicitud con tipos (permiso, licencia, otro)
- Flujo de aprobación/rechazo (pendiente → aprobado/rechazado)
- Consultas por empleado

### ✅ Dashboard y Reportes
- KPIs en vivo: empleados activos, asistencias hoy, permisos pendientes, órdenes activas
- Tabla de asistencias del día con datos del empleado
- Exportación a Excel (.xlsx)
- Actualización en tiempo real con Socket.io

### ✅ Seguridad
- HTTPS con SSL
- Helmet, CORS, rate limiting
- Hash de contraseñas con bcrypt (12 rounds)
- Validación Zod en entrada
- Logging estructurado con Pino (auto-redacta campos sensibles)
- Auditoría append-only para operaciones críticas

### ✅ Multi-Tenant
- Aislamiento por empresa en todas las entidades
- Contexto de tenant inyectado en cada request
- Superuser con acceso cross-tenant

### ✅ Notificaciones
- Registro de push tokens
- Infraestructura para notificaciones push

### ✅ Configuración de Empresa (NUEVO)
- Ubicación geográfica configurable desde el desktop
- Radio de geocerca ajustable (50–2000m)
- Mapa interactivo con `flutter_map`
- Persistencia en `PUT /api/companies`

## Lo que NO está implementado (brechas)

- **Mobile (Flutter)**: Los botones de marcaje todavía son placeholders. Solo la versión Flutter de mobile tiene la implementación funcional con GPS. La versión Expo/RN tiene los slices de Redux y el layout pero la integración con el API de locations no está conectada.
- **Pruebas automatizadas**: Solo hay tests unitarios mínimos en `__tests__/`. No hay tests de integración ni E2E.
- **Olvidé mi contraseña / Recovery**: No hay flujo de recuperación de contraseña.
- **Internacionalización**: Solo español (ES-BO). No hay soporte multi-idioma.
- **Dashboard histórico**: Solo muestra el día actual. No hay vista histórica de KPIs.
- **Onboarding**: No hay tour de bienvenida ni configuración inicial guiada.

## Pendientes Técnicos

| Ítem | Prioridad |
|------|-----------|
| Conectar Expo mobile con API de locations | Alta |
| Tests de integración para geocerca | Media |
| Rate limiting granular por endpoint | Media |
| Error handling global uniforme (todos los controllers) | Baja |
| Migrar a Express async error handler nativo | Baja |
