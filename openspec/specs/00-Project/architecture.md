---
title: Architecture
project: Nexo
version: 1.0.0
status: Approved
type: Foundation Specification
last_updated: 2026-07-02
related:
  - overview.md
  - glossary.md
  - business-rules.md
---

# Nexo — Architecture

## 1. System Overview

```
┌──────────────────────┐   ┌──────────────────────┐
│  Mobile (React       │   │  Desktop (C# MAUI)   │
│  Native / Expo)      │   │  (en desarrollo)     │
│  - Employee flow     │   │  - Admin/Manager     │
│  - GPS punch         │   │  - Dashboard/Reports │
│  - Work orders       │   │  - Full CRUD         │
└─────────┬────────────┘   └───────────┬──────────┘
          │                            │
          │       HTTPS + JWT          │
          └────────────┬───────────────┘
                       │
              ┌────────▼─────────┐
              │  Express 5 API   │
              │  + Socket.io     │
              │  + Pino Logger   │
              └────────┬─────────┘
                       │
              ┌────────▼─────────┐
              │  MongoDB Atlas   │
              │  + Mongoose 9    │
              └──────────────────┘
```

## 2. Stack

| Capa | Tecnología | Estado |
|------|-----------|--------|
| Backend | Express 5 + TypeScript + Mongoose | ✅ En producción |
| Base de datos | MongoDB Atlas | ✅ En producción |
| Mobile | Expo / React Native + Redux Toolkit + NativeWind | ✅ En producción |
| Desktop | C# .NET MAUI | 🔧 En desarrollo |
| Tiempo real | Socket.io | ✅ Implementado |
| Auth | JWT (access 24h + refresh 7d) + bcrypt | ✅ Implementado |
| Logging | Pino | ✅ Implementado |
| Validación | Zod | ✅ Implementado |

## 3. Backend Architecture

### Patrón
Express 5 con capas: `Routes → Controllers → Services → Repositories → Mongoose Models`

### Auto-descubrimiento de rutas
Los archivos en `src/routes/` se montan automáticamente bajo `/api/{filename}`.

### Endpoints actuales

| Recurso | Métodos | Auth |
|---------|---------|------|
| `/api/auth` | POST register, login, refresh | No |
| `/api/employees` | GET, POST | JWT |
| `/api/clients` | GET, POST | JWT |
| `/api/companies` | GET, POST, PATCH | JWT + superuser |
| `/api/locations` | GET, POST | JWT |
| `/api/permissions` | GET, POST | JWT |
| `/api/vacations` | GET, POST | JWT |
| `/api/work-orders` | GET, POST | JWT |
| `/api/health` | GET | No |

### Multi-tenant
- Toda entidad tiene un campo `company` (ObjectId ref a Company)
- Los repositorios filtran por `context.companyId`
- Superuser Nexo puede romper el aislamiento

### Auth
- Dos colecciones de usuarios: `employees` (mobile) y `admins` (desktop)
- JWT payload: `{ employeeId, email, username, companyId, role, userType }`
- Middleware `verifyToken` + guards `requireSuperuser` / `requireCompanyAccess`

## 4. Data Model (MongoDB)

| Colección | Propósito |
|-----------|-----------|
| companies | Empresas inquilinas con inviteCode |
| employees | Usuarios mobile (colaboradores) |
| admins | Usuarios desktop (gerentes, admins) |
| clients | Clientes registrados por Employee |
| jobTitles | Cargos por empleado |
| timeControls | Marcaje diario (entrada, descanso, retorno, salida) |
| locations | Historial de geolocalización |
| vacations | Solicitudes de vacaciones |
| permissions | Solicitudes de permisos |
| workOrders | Órdenes de trabajo |

Toda colección filtra por `company`. No existe acceso cruzado entre tenants.

## 5. Desktop Architecture (MAUI)

### Patrón
MVVM con dependencia explícita del REST API de Nexo.

```
┌──────────────────────────────────┐
│  Views (XAML)                    │
│  - LoginView, DashboardView      │
│  - EmployeeListView, ReportsView │
│  - WorkOrderView, VacationView   │
└──────────────┬───────────────────┘
               │ Binding
┌──────────────▼───────────────────┐
│  ViewModels                      │
│  - ObservableObject base         │
│  - Commands (ICommand)           │
│  - State management              │
└──────────────┬───────────────────┘
               │
┌──────────────▼───────────────────┐
│  Services                        │
│  - ApiService (HttpClient)       │
│  - AuthService (JWT storage)     │
│  - ReportService (Excel export)  │
└──────────────┬───────────────────┘
               │ HTTP + JWT
┌──────────────▼───────────────────┐
│  Express 5 API                   │
└──────────────────────────────────┘
```

### Funcionalidades planeadas para Release 1.0
- Login con JWT (almacenado en SecureStorage)
- Dashboard con KPIs en tiempo real (asistencia, órdenes activas)
- CRUD completo de empleados, clientes, órdenes
- Reportes exportables a Excel, CSV, JSON
- Tablas con búsqueda, filtros y paginación

## 6. Seguridad

- JWT con expiry 24h + refresh token 7d
- Contraseñas con bcrypt (12 rounds)
- Cifrado en tránsito vía TLS (HTTPS obligatorio)
- Aislamiento multi-tenant en capa de datos
- Logging de auditoría para cambios críticos
- No almacenar secrets en Dockerfile ni repositorio

## 7. Despliegue (por definir)

Pendiente de definir. Opciones recomendadas:
- Backend: Railway / Fly.io / VPS con Docker
- Base de datos: MongoDB Atlas (ya en uso)
- Mobile: EAS Build + App Store / Play Store
- Desktop: Instalador MSI (WiX Toolset o similar)

## 8. Pendientes técnicos

- Endpoints faltantes: PUT/DELETE para permissions, vacations, work orders
- Paginación en listas
- Manejo de errores consistente en controllers
- Tests: coverage actual < 1%
- Migrar secrets de Dockerfile a variables de entorno
- Limpiar archivo `server/nodemon,json` (typo en nombre)
- Eliminar `desktop/` (Flutter stub) del repositorio
