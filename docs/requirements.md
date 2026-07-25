# Product Requirements Document (PRD)

## Nexo - Sistema de Gestión de Empleados y Asistencia

---

| Campo | Detalle |
| ------- | --------- |
| **Versión** | 1.0.0 |
| **Estado** | Draft |
| **Última actualización** | 2026-07-24 |
| **Autor** | Paulo Castillo |
| **Plataforma** | Tri-plataforma (Backend, Mobile, Desktop) |

---

## 1. Resumen Ejecutivo

### 1.1 Propósito del Producto

**Nexo** es una plataforma tri-plataforma, multi-tenant diseñada para la gestión integral de empleados y el seguimiento de asistencia con ubicación en tiempo real. El sistema permite a las empresas controlar la asistencia de sus empleados mediante marcaciones con coordenadas GPS, ha identificar cuando el empleado ingresa a la zona laboral, utilizando geofences, gestionar órdenes de trabajo, permisos, vacaciones y generar reportes para los administrativos.

### 1.2 Propuesta de Valor

- **Visibilidad en tiempo real**: Conocimiento de la ubicación y estado de cada empleado
- **Tri-plataforma**: Acceso desde móvil (empleados y gerente o dueño del negocio), desktop (managers/admins) y backend API
- **Automatización de asistencia**: Registro automático de entrada, descanso y salida, con la opción de que también aparezca en el sistema el tiempo en el que el empleado a ingresado a la zona laboral luego de su descanso, el cual marcará la hora de retorno del descanso pero no es necesario que el empleado realice el marcado de su retorno del almuerzo. 
- **Gestión integral**: Módulo completo de RR.HH. (permisos, vacaciones, clientes, órdenes de trabajo y gestión de las horas extras para el correspondiente pago)

### 1.3 Usuarios Objetivo

| Rol | Descripción | Permisos Clave |
|-----|-------------|----------------|
| **Superuser Nexo** | Equipo interno de soporte de Nexo. Acceso total a todas las empresas y configuraciones del sistema. | Ver y modificar cualquier empresa. CRUD completo en todo el sistema. Previa autorización del dueño de la empresa. |
| **Superuser Empresa** | Gerente general o dueño de la empresa cliente. Control total sobre su tenant. | CRUD completo sobre su propia empresa. No puede ver ni acceder a datos de otras empresas. |
| **Company Admin** | Administrador operativo de la empresa. | Gestiona usuarios, roles y configuraciones dentro de su empresa. Sin acceso a facturación ni cambios de plan. |
| **HR Manager** | Gestor de RRHH de la empresa. | Gestiona empleados, asistencia, documentos y órdenes de trabajo. No gestiona roles ni configuración de empresa. |
| **Employee** | Colaborador de la empresa. | Acceso a su perfil, marcar asistencia, crear y ver órdenes de trabajo, registrar y actualizar datos de clientes de la empresa. |
| **Auditor** | Auditor interno o externo. | Acceso de solo lectura a registros de auditoría, reportes y actividad de la empresa asignada. |

### 1.4 Alcance del Proyecto

Nexo cubre los siguientes dominios funcionales:

- **Employee Management** — CRUD de colaboradores, perfiles, datos contractuales y documentación asociada.
- **Attendance** — Registro de entrada, descanso, retorno y salida con geolocalización y validación por coordenadas.
- **Work Orders** — Creación, asignación, seguimiento y cierre de órdenes de trabajo con trazabilidad de estado.
- **Customer Management** — Registro y actualización de clientes asociados a cada empresa inquilina.
- **Document Management** — Almacenamiento, control de versiones y consulta de documentos del personal.
- **Notifications** — Sistema de notificaciones push, in-app y WebSocket en tiempo real.
- **Reports** — Reportes operativos, de auditoría y de horarios consolidados por colaborador y por empresa.
- **Authentication** — Autenticación, control de acceso basado en roles (RBAC) y sesiones por tenant.
- **Company Management** — Administración de la empresa inquilina con monitoreo en tiempo real de horarios (entrada, descanso, retorno, salida), ubicación de marcaje y reporte consolidado de horarios de todos los colaboradores.
- **Geolocation** — Captura y registro de coordenadas geográficas asociadas a marcaje de asistencia y operaciones en campo.

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NEXO PLATFORM                                │
│                                                                     │
│  ┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐  │
│  │  Mobile App   │   │  Desktop App     │   │  External Sys     │  │
│  │  (Expo/RN)    │   │  (Flutter)       │   │                   │  │
│  │  Employees    │   │  Managers/Admin  │   │  ┌─────────────┐  │  │
│  │  GPS Punch    │   │  Dashboard       │   │  │  Twilio     │  │  │
│  │  Requests     │   │  Reports/Excel   │   │  │  WhatsApp   │  │  │
│  └──────┬───────┘   └──────┬───────────┘   │  └──────┬──────┘  │  │
│         │                  │               │         │         │  │
│         │    HTTPS/JSON    │               │  Webhook│         │  │
│         ▼                  ▼               │         ▼         │  │
│  ┌──────────────────────────────────────────────────────────┐   │  │
│  │              EXPRESS API GATEWAY                           │   │  │
│  │  ┌───────┐ ┌───────┐ ┌──────┐ ┌───────┐ ┌───────────┐   │   │  │
│  │  │ Auth  │ │ Time  │ │ RRHH │ │ Dash  │ │  Reports  │   │   │  │
│  │  │Module │ │Control│ │Module│ │Module │ │  Module   │   │   │  │
│  │  └───┬───┘ └───┬───┘ └──┬───┘ └──┬───┘ └─────┬─────┘   │   │  │
│  │      └─────────┴────────┴────────┴───────────┘          │   │  │
│  └──────────────────────────────────────────────────────────┘   │  │
│                              │                                    │  │
│                              ▼                                    │  │
│              ┌──────────────────────────────┐                     │  │
│              │         MongoDB              │                     │  │
│              │  (Mongoose ODM)              │                     │  │
│              └──────────────────────────────┘                     │  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Background Workers (Bull Queue + node-cron)                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │  │
│  │  │ Missed Punch │  │ Vacation     │  │ WhatsApp         │   │  │
│  │  │ Detection    │  │ Balance Calc │  │ Notification     │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Componentes del Sistema

| Componente | Tecnología | Propósito |
| :--------: | :--------: | :----------: |
| Backend API | Node.js Express 5 + TypeScript | API REST con JWT |
| Base de Datos | MongoDB + Mongoose | Almacenamiento persistente |
| Tiempo Real | Socket.io | Actualizaciones en vivo |
| Mobile App | React Native (Expo 56) | Interfaz para empleados |
| Desktop App | Flutter 3.6+ | Interfaz para managers/business_owners/superUser_Nexo |
| Cola de Mensajes | Bull Queue + Redis | procesamiento async |
| Notificaciones | Twilio WhatsApp | Alertas y notificaciones |

---

## 3. Requisitos Funcionales

- Timesheets, horarios/turnos, aprobaciones
- Reportes y exportación (PDF/Excel)
- Notificaciones (recordatorios, aprobaciones)
- Multi-tenant (empresas → equipos → empleados), roles y permisos
- Clientes: apps móviles (iOS/Android), app de escritorio (Win/Mac/Linux), web

### 3.1 Módulo de Autenticación

| ID | Requisito | Prioridad | Plataforma |
|----|-----------|-----------|------------|
| AUTH-001 | Inicio de sesión con email y contraseña | Alta | Todas |
| AUTH-002 | Registro de nuevos empleados | Alta | Desktop |
| AUTH-003 | Autenticación JWT con expiración 24h | Alta | Todas |
| AUTH-004 | Roles: employee, manager, admin | Alta | Todas |
| AUTH-005 | Logout e invalidación de token | Media | Mobile |
| AUTH-006 | Recuperación de contraseña | Baja | Todas |

### 3.2 Módulo de Control de Tiempo

| ID | Requisito | Prioridad | Plataforma |
|----|-----------|-----------|------------|
| TIME-001 | Registro de entrada con GPS | Alta | Mobile |
| TIME-002 | Inicio de descanso con GPS | Alta | Mobile |
| TIME-003 | Retorno de descanso con GPS | Alta | Mobile |
| TIME-004 | Registro de salida con GPS | Alta | Mobile |
| TIME-005 | Visualización de historial de asistencia | Alta | Mobile/Desktop |
| TIME-006 | Detección de punches perdidos (cron job) | Media | Backend |
| TIME-007 | Reporte de asistencia por rango de fechas | Alta | Desktop |
| TIME-008 | Exportación a Excel de reportes | Alta | Desktop |

### 3.3 Módulo de Órdenes de Trabajo

| ID | Requisito | Prioridad | Plataforma |
|----|-----------|-----------|------------|
| WORK-001 | Creación de órdenes de trabajo | Alta | Desktop |
| WORK-002 | Asignación de empleado a orden | Alta | Desktop |
| WORK-003 | Asignación de cliente a orden | Alta | Desktop |
| WORK-004 | Descripción y ubicación de orden | Alta | Desktop |
| WORK-005 | Lista de órdenes del día (empleado) | Alta | Mobile |
| WORK-006 | Actualización de estado de orden | Media | Mobile |
| WORK-007 | Visualización de ubicación en mapa | Media | Mobile |

### 3.4 Módulo de Clientes

| ID | Requisito | Prioridad | Plataforma |
|----|-----------|-----------|------------|
| CLIENT-001 | Registro de clientes | Alta | Desktop |
| CLIENT-002 | Lista de clientes | Alta | Desktop |
| CLIENT-003 | Edición de cliente | Media | Desktop |
| CLIENT-004 | Eliminación de cliente | Baja | Desktop |
| CLIENT-005 | Asignación de clientes a empleados | Alta | Desktop |

### 3.5 Módulo de Permisos

| ID | Requisito | Prioridad | Plataforma |
|----|-----------|-----------|------------|
| PERM-001 | Solicitud de permiso (empleado) | Alta | Mobile |
| PERM-002 | Aprobación de permiso (manager) | Alta | Desktop |
| PERM-003 | Rechazo de permiso (manager) | Alta | Desktop |
| PERM-004 | Tipos de permiso (enfermedad, personal, etc.) | Alta | Todas |
| PERM-005 | Historial de permisos por empleado | Media | Desktop |

### 3.6 Módulo de Vacaciones

| ID | Requisito | Prioridad | Plataforma |
|----|-----------|-----------|------------|
| VAC-001 | Solicitud de vacaciones (empleado) | Alta | Mobile |
| VAC-002 | Aprobación de vacaciones (manager) | Alta | Desktop |
| VAC-003 | Cálculo automático de saldo (cron) | Media | Backend |
| VAC-004 | Historial de vacaciones por empleado | Media | Desktop |
| VAC-005 | Balance de días disponibles | Media | Mobile/Desktop |

### 3.7 Módulo de Ubicación en Tiempo Real

| ID | Requisito | Prioridad | Plataforma |
|----|-----------|-----------|------------|
| LOC-001 | Envío de ubicación GPS desde mobile | Alta | Mobile |
| LOC-002 | Receptor de ubicación en backend | Alta | Backend |
| LOC-003 | Visualización de ubicación en tiempo real | Alta | Desktop |
| LOC-004 | Namespace Socket.io `/locations` | Alta | Backend |
| LOC-005 | Historial de ubicaciones por empleado | Media | Desktop |

### 3.8 Módulo de Reportes

| ID | Requisito | Prioridad | Plataforma |
|----|-----------|-----------|------------|
| REP-001 | Reporte de asistencia por empleado | Alta | Desktop |
| REP-002 | Reporte de asistencia por rango de fechas | Alta | Desktop |
| REP-003 | Exportación a Excel (.xlsx) | Alta | Desktop |
| REP-004 | Resumen de dashboard (empleados activos, etc.) | Alta | Todas |
| REP-005 | Reporte de permisos y vacaciones | Media | Desktop |

---

## 4. Requisitos No Funcionales

### 4.1 Rendimiento

| Requisito | Criterio |
|-----------|----------|
| Tiempo de respuesta API | < 200ms para operaciones CRUD |
| Tiempo de carga inicial mobile | < 3 segundos en 3G |
| Tiempo de carga inicial desktop | < 2 segundos |
| Soporte de usuarios concurrentes | 100+ usuarios simultáneos |

### 4.2 Escalabilidad

| Requisito | Criterio |
|-----------|----------|
| Arquitectura de microservices | Listo para dividir en módulos NestJS |
| Base de datos | MongoDB con soporte para sharding |
| Cola de mensajes | Bull Queue con Redis para escalabilidad horizontal |

### 4.3 Seguridad

| Requisito | Criterio |
|-----------|----------|
| Autenticación | JWT con expiración configurable |
| Contraseñas | bcrypt con 12 rounds |
| HTTPS | Solo conexiones seguras |
| Rate limiting | Implementado en API |
| Validación de datos | class-validator DTOs |
| Aislamiento multi-tenant | companyId en cada documento |

### 4.4 Disponibilidad

| Requisito | Criterio |
|-----------|----------|
| Uptime objetivo | 99.5% |
| Recuperación ante desastres | Backup diario de MongoDB |
| Health check endpoint | `GET /` retorna estado del sistema |

### 4.5 Usabilidad

| Requisito | Criterio |
|-----------|----------|
| Accesibilidad | Soporte para lectores de pantalla |
| Modo oscuro | Theme toggle (futuro) |
| Multiidioma | Preparado para i18n |
| Offline | Cola de sincronización (futuro) |

---

## 5. Modelo de Datos

### 5.1 Entidades Principales

```
Employee (empleado)
├── _id: ObjectId
├── username: String (único)
├── companyName: String
├── email: String (único)
├── password: String (hash bcrypt)
├── phone: String
├── jobTitle: String
├── role: 'employee'
├── controlTimeID: ObjectId → ControlTime
└── createdAt, updatedAt: Date

Client (cliente)
├── _id: ObjectId
├── name: String
├── address: String
├── phone: String
├── email: String
├── createdAt, updatedAt: Date

BusinessOwner (dueño de negocio)
├── _id: ObjectId
├── name: String
├── email: String
├── password: String
├── role: "business owner"
├── createdAt, updatedAt: Date

Manager (adminsitrativo)
├── _id: ObjectId
├── name: String
├── email: String
├── address: String
├── phone: String
├── role: "manager"
├── createdAt, updatedAt: Date

WorkOrder (orden de trabajo)
├── _id: ObjectId
├── employee: ObjectId → Employee
├── client: ObjectId → Client
├── clientName: String
├── location: { latitude: Number, longitude: Number }
├── description: String
├── date: Date
└── createdAt, updatedAt: Date

ControlTime (control de asistencia)
├── _id: ObjectId
├── employee: ObjectId → Employee
├── date: Date
├── entrada: String (hora)
├── descanso: String (hora)
├── retorno: String (hora)
├── salida: String (hora)
├── location: ObjectId → Location
└── createdAt, updatedAt: Date

Permission (permiso)
├── _id: ObjectId
├── employee: ObjectId → Employee
├── type: String
├── startDate: Date
├── endDate: Date
├── status: Enum ['pending', 'approved', 'rejected']
├── reason: String
└── createdAt, updatedAt: Date

Vacation (vacaciones)
├── _id: ObjectId
├── employee: ObjectId → Employee
├── startDate: Date
├── endDate: Date
├── days: Number
├── status: Enum ['pending', 'approved', 'rejected']
├── reason: String
└── createdAt, updatedAt: Date

Location (ubicación)
├── _id: ObjectId
├── employee: ObjectId → Employee
├── latitude: Number
├── longitude: Number
├── timestamp: Date
└── createdAt: Date

```

---

## 6. API Endpoints

### 6.1 Autenticación

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| POST | `/api/auths/register` | Registro de empleado | Admin |
| POST | `/api/auths/login` | Inicio de sesión | Todas |
| GET | `/api/auths/profile` | Perfil del usuario | Todas |

### 6.2 Empleados

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/employees` | Lista de empleados | Manager, Admin |
| GET | `/api/employees/:id` | Detalle de empleado | Manager, Admin |
| POST | `/api/employees` | Crear empleado | Admin |
| PUT | `/api/employees/:id` | Actualizar empleado | Admin |
| DELETE | `/api/employees/:id` | Eliminar empleado | Admin |

### 6.3 Control de Tiempo

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/employees/time-controls` | Historial de asistencia | Employee, Manager, Admin |
| POST | `/api/employees/time-in` | Registrar entrada | Employee |
| POST | `/api/employees/break-start` | Iniciar descanso | Employee |
| POST | `/api/employees/break-end` | Finalizar descanso | Employee |
| POST | `/api/employees/time-out` | Registrar salida | Employee |

### 6.4 Órdenes de Trabajo

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/work-orders` | Lista de órdenes | Manager, Admin |
| GET | `/api/work-orders/today` | Órdenes del día | Employee, Manager, Admin |
| POST | `/api/work-orders` | Crear orden | Manager, Admin |
| PUT | `/api/work-orders/:id` | Actualizar orden | Manager, Admin |
| DELETE | `/api/work-orders/:id` | Eliminar orden | Admin |

### 6.5 Clientes

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/clients` | Lista de clientes | Manager, Admin |
| POST | `/api/clients` | Crear cliente | Admin |
| PUT | `/api/clients/:id` | Actualizar cliente | Admin |
| DELETE | `/api/clients/:id` | Eliminar cliente | Admin |

### 6.6 Permisos

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/permissions` | Lista de permisos | Manager, Admin |
| GET | `/api/permissions/my` | Mis permisos | Employee |
| POST | `/api/permissions` | Solicitar permiso | Employee |
| PUT | `/api/permissions/:id/approve` | Aprobar permiso | Manager, Admin |
| PUT | `/api/permissions/:id/reject` | Rechazar permiso | Manager, Admin |

### 6.7 Vacaciones

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/vacations` | Lista de vacaciones | Manager, Admin |
| GET | `/api/vacations/my` | Mis vacaciones | Employee |
| POST | `/api/vacations` | Solicitar vacaciones | Employee |
| PUT | `/api/vacations/:id/approve` | Aprobar vacaciones | Manager, Admin |
| PUT | `/api/vacations/:id/reject` | Rechazar vacaciones | Manager, Admin |

### 6.8 Ubicaciones

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/locations` | Lista de ubicaciones | Manager, Admin |
| GET | `/api/locations/employee/:id` | Ubicación de empleado | Manager, Admin |
| POST | `/api/locations` | Enviar ubicación | Employee |
| GET | `/api/locations/realtime` | Ubicaciones en tiempo real | Manager, Admin |

### 6.9 Dashboard

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/dashboard/summary` | Resumen del dashboard | Manager, Admin |
| GET | `/api/dashboard/stats` | Estadísticas | Manager, Admin |

---

## 7. Casos de Uso

### 7.1 Caso de Uso: Registro de Asistencia

**Actor**: Empleado

**Flujo principal**:

1. Empleado abre la aplicación mobile
2. Sistema verifica autenticación JWT
3. Empleado presiona botón "Entrada"
4. Mobile captura ubicación GPS actual
5. Mobile envía POST `/api/employees/time-in` con ubicación
6. Backend registra ControlTime con entrada y ubicación
7. Backend retorna confirmación
8. Mobile actualiza UI con estado de asistencia

**Flujo alternativo**: Si no hay conexión, almacenar en cola local y sincronizar cuando haya conexión.

### 7.2 Caso de Uso: Aprobación de Permiso

**Actor**: Manager

**Flujo principal**:

1. Manager abre aplicación desktop
2. Sistema verifica autenticación JWT con rol manager
3. Manager navega a sección "Permisos"
4. Sistema lista permisos pendientes
5. Manager selecciona un permiso
6. Sistema muestra detalles del permiso
7. Manager presiona "Aprobar"
8. Backend actualiza status a 'approved'
9. Sistema notifica al empleado (WhatsApp - futuro)

### 7.3 Caso de Uso: Generación de Reporte

**Actor**: Administrador

**Flujo principal**:

1. Admin abre aplicación desktop
2. Sistema verifica autenticación JWT con rol admin
3. Admin navega a sección "Reportes"
4. Admin selecciona tipo de reporte (asistencia)
5. Admin define rango de fechas
6. Admin selecciona empleados (todos o específicos)
7. Admin presiona "Generar"
8. Backend procesa datos (puede usar Bull Queue)
9. Backend genera archivo Excel
10. Admin descarga archivo Excel

---

## 8. Historias de Usuario por Prioridad

### 8.1 Sprint 1 - Core Funcionalidad

| ID | Historia de Usuario | Criterios de Aceptación |
|----|---------------------|------------------------|
| US-001 | Como empleado, quiero registrar mi entrada con un clic para iniciar mi jornada | - Botón visible en home screen - GPS se captura automáticamente - Confirmación visual inmediata |
| US-002 | Como empleado, quiero ver mis órdenes de trabajo del día para saber dónde ir | - Lista de órdenes cargada al abrir app - Cada orden muestra cliente, ubicación, descripción |
| US-003 | Como manager, quiero aprobar permisos solicitados por mi equipo | - Lista de permisos pendientes visible - Botones de aprobar/rechazar funcionales |
| US-004 | Como admin, quiero exportar reporte de asistencia a Excel | - Selección de rango de fechas - Selección de empleados - Descarga de archivo .xlsx |

### 8.2 Sprint 2 - Funcionalidades Avanzadas

| ID | Historia de Usuario | Criterios de Aceptación |
|----|---------------------|------------------------|
| US-005 | Como manager, quiero ver la ubicación en tiempo real de mis empleados | - Mapa con pins de empleados - Actualización cada 30 segundos |
| US-006 | Como empleado, quiero solicitar vacaciones con fechas específicas | - Formulario con fecha inicio/fin - Motivo opcional - Estado pending visible |
| US-007 | Como admin, quiero gestionar clientes de la empresa | - CRUD completo de clientes - Asignación a empleados |
| US-008 | Como empleado, quiero solicitar permisos por enfermedad | - Tipo de permiso seleccionable - Fecha inicio/fin - Estado visible |

### 8.3 Sprint 3 - Mejoras y Optimización

| ID | Historia de Usuario | Criterios de Aceptación |
|----|---------------------|------------------------|
| US-009 | Como usuario, quiero notificaciones cuando меня approve/rechazan solicitudes | - Notificación push en mobile - Notificación WhatsApp (futuro) |
| US-010 | Como admin, quiero ver dashboard con estadísticas del equipo | - Total empleados activos - Asistencias de hoy - Permisos pendientes |
| US-011 | Como empleado, quiero modo oscuro para usar la app de noche | - Theme toggle en settings - Persistencia del preference |
| US-012 | Como usuario, quiero que la app funcione sin internet | - Cola de operaciones offline - Sincronización automática al conectar |

---

## 9. Matriz de Trazabilidad

| Requisito | Módulo Backend | Mobile | Desktop | Test |
|-----------|----------------|--------|---------|------|
| AUTH-001 | ✅ | ✅ | ✅ | |
| AUTH-002 | ✅ | | ✅ | |
| TIME-001 | ✅ | ✅ | | |
| TIME-002 | ✅ | ✅ | | |
| TIME-007 | ✅ | | ✅ | |
| WORK-001 | ✅ | | ✅ | |
| WORK-005 | ✅ | ✅ | | |
| CLIENT-001 | ✅ | | ✅ | |
| PERM-001 | ✅ | ✅ | | |
| PERM-002 | ✅ | | ✅ | |
| VAC-001 | ✅ | ✅ | | |
| LOC-001 | ✅ | ✅ | | |
| LOC-003 | ✅ | | ✅ | |
| REP-003 | ✅ | | ✅ | |

---

## 10. Cronograma Tentativo

| Fase | Duración | Entregables |
|------|----------|-------------|
| Sprint 1 | 2 semanas | Autenticación, Control de tiempo básico, Órdenes del día |
| Sprint 2 | 2 semanas | Permisos, Vacaciones, Clientes, Dashboard |
| Sprint 3 | 2 semanas | Reportes Excel, Ubicación en tiempo real, Mejoras UI |
| Sprint 4 | 2 semanas | Notificaciones, Modo offline, Testing completo |

**Total estimado**: 8 semanas para MVP

---

## 11. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Retrasos en integración de GPS | Media | Alto | Usar biblioteca establecida (expo-location) |
| Problemas de rendimiento con muchos empleados | Baja | Alto | Implementar paginación desde el inicio |
| Cambios en requisitos de API | Media | Medio | Documentar contratos de API con Swagger |
| Issues de seguridad en producción | Baja | Alto | Auditoría de seguridad antes del launch |
|离线功能复杂度 | Alta | Medio | Implementar cola de sync desde el inicio |

---

## 12. Glosario

| Término | Definición |
|---------|------------|
| **Punch** | Registro de asistencia (entrada, descanso, retorno, salida) |
| **WorkOrder** | Orden de trabajo asignada a un empleado |
| **ControlTime** | Registro diario de asistencia de un empleado |
| **Multi-tenancy** | Arquitectura que permite múltiples empresas en una instancia |
| **JWT** | JSON Web Token para autenticación |
| **Geofencing** | Validación de ubicación dentro de una zona geográfica |
| **Nexo** | Nombre comercial de la plataforma |

---

## 13. Anexos

### 13.1 Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Backend | Node.js | 22.14.0+ |
| Framework | Express | 5.1.0 |
| Base de Datos | MongoDB | Latest |
| ODM | Mongoose | Latest |
| Tiempo Real | Socket.io | Latest |
| Mobile | React Native | 0.79 |
| Mobile Framework | Expo | 53 |
| State Management | Redux Toolkit | Latest |
| Desktop | Flutter | 3.6+ |
| HTTP Client (Mobile) | Axios | Latest |
| HTTP Client (Desktop) | Dio | Latest |

### 13.2 Referencias

- Documento General: `overview.md`
- Documento de desarrollo: `development-workflow.md`
- Documento de las reglas de negocio: `business-rules.md`

---
