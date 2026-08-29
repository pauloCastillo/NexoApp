# NexoApp — Plataforma de gestión operativa empresarial

> **SSOT del producto:** `~/.opencode/docs/00_meta/ssot.md` + `PRD_Master.md` (fuera del repo en second-brain). Este repo contiene solo la implementación. Ver `docs/refactoring-alignment.md` para brechas actuales y `ESTADO-DEL-SISTEMA.md` para el estado operativo detallado.

Nexo centraliza control de asistencia con geocerca GPS, gestión de colaboradores/clientes, órdenes de trabajo, permisos/vacaciones y dashboard en tiempo real (Socket.io). Multi-tenant por empresa, con clientes separados: **desktop** para dueños/gerentes y **mobile** para empleados.

```
app (Flutter: mobile + desktop) ──┐
                                   ├──► server (Express 5 + Mongoose + Socket.io + JWT) ──► MongoDB Atlas
app (Flutter: mobile + desktop) ──┘          ▲  /api/*  (Zod, Pino, tenantGuard, RBAC)
```

---

## Stack

| Capa | Tec | Versión |
|------|-----|---------|
| Backend | Node.js + Express 5 + TypeScript 6 | `>=22.14.0` |
| DB / ODM | MongoDB Atlas + Mongoose 9 | — |
| Realtime | Socket.io 4 | — |
| Auth | JWT + bcrypt | access 24h / refresh 7d |
| Validación / Log | Zod 4 + Pino 10 | — |
| Cliente | Flutter 3.12 (Dart `^3.12.2`) — Riverpod, go_router, dio, hive, geolocator, flutter_map, share_plus | — |

## Estructura

```
.
├── server/                 # API Express — entrypoint main.ts (ver AGENTS.md)
│   ├── src/routes/*.ts     # cada archivo → /api/<nombre> (auto-mount en src/routes/index.ts)
│   ├── src/db/models/      # Mongoose: user, company, department, timeControl, workOrder, ...
│   ├── src/middlewares/    # tenantGuard, verifyToken, validate (Zod)
│   └── scripts/            # migrate-rename-owner-role.ts, migrate-rename-roles.ts
├── app/                    # Flutter único (mobile + desktop)
│   ├── lib/main_mobile.dart / lib/main_desktop.dart  # entrypoints reales
│   ├── lib/presentation/desktop/ + lib/presentation/mobile/  # shells y navegación
│   └── lib/core/{auth,routing,network,storage} + lib/data + lib/domain + lib/features
├── openspec/               # cambios spec-driven (proposal/design/tasks/specs)
│   └── changes/<nombre>/
├── .opencode/docs/         # PRD/SSOT espejado, RNF/RF, roadmap
├── docs/refactoring-alignment.md  # trazabilidad RN/RF → repo
└── ESTADO-DEL-SISTEMA.md   # endpoints y colecciones detalladas
```

Sin `package.json` en la raíz. `server/` y `app/` son proyectos independientes.

---

## Requisitos

- **Node** `>=22.14.0` + **pnpm** (server declara `pnpm.onlyBuiltDependencies`)
- **Flutter** `3.12.x` / **Dart** `^3.12.2` (`flutter --version`)
- **MongoDB Atlas** accesible (URI en `server/.env`)
- OpenSSL certs solo para `DEV_STATUS != development`

---

## Configuración

### server/.env

```ini
DEV_STATUS=development        # development → HTTP + sin rate-limit; otro valor → HTTPS (lee SSL_KEY/SSL_CERT)
PORT_DEV=8080
PORT_PROD=8080
DB_URI=mongodb+srv://...      # Atlas
JWT_SECRET_KEY=...
SSL_KEY=./etc/cert/key.pem    # requerido solo en prod
SSL_CERT=./etc/cert/cert.pem
```

> `server/main.ts:22` decide puerto/protocolo por `DEV_STATUS`. En prod `fs.readFileSync(SSL_KEY/SSL_CERT)` debe existir o crashea (`main.ts:64`).

### app/.env

```ini
API_URL=http://<host>:8080/api   # IP hardcodeada — cámbiala por entorno (actual: 192.168.1.18)
```

`app/lib/core/network/dio_client.dart` lee `API_URL`.

---

## Desarrollo

### Server

```bash
cd server
pnpm install
pnpm dev          # tsx watch main.ts — levanta http://localhost:8080
pnpm lint         # eslint src/ main.ts
pnpm typecheck    # tsc --noEmit
pnpm test         # NODE_OPTIONS=--experimental-vm-modules jest (testMatch **/__tests__/**/*.test.ts)
pnpm migrate      # migra owner→business_owner; para 8-roles usar scripts/migrate-rename-roles.ts
pnpm build && pnpm start   # tsc → node dist/main.js
```

Orden recomendado: `lint → typecheck → test`. `nodemon.json` observa `src/` (no usado por `pnpm dev`).

**Quirks:**
- Imports ESM con extensión `.js` obligatoria (`import ... from '@/routes/index.js'`) — `NodeNext` (`tsconfig.json:17`, paths `@/*`→`src/*`).
- `vendors/xlsx-0.20.2.tgz` es vendored (`file:`) — no cambiar sin validar `reportService`.

### App (Flutter)

```bash
cd app
flutter pub get
flutter analyze
flutter test
flutter run -t lib/main_mobile.dart   # mobile (employee + admin)
flutter run -t lib/main_desktop.dart  # desktop (owner/manager)
# builds
flutter build apk --flavor mobile -t lib/main_mobile.dart
flutter build linux -t lib/main_desktop.dart
```

Lints: `package:flutter_lints` (`analysis_options.yaml`).

---

## API

Base `/api`. Rutas se auto-registran: cada `server/src/routes/<nombre>.ts` se monta como `/api/<nombre>` (`src/routes/index.ts:12`).

| Grupo | Prefijo | Auth | Notas |
|-------|---------|------|-------|
| Health | `GET /api/health` | — | uptime, db, memory |
| Auth | `/api/auth` | mixto | `POST /register /login /refresh`, `POST /logout` (JWT), `PUT /password` (JWT) |
| Companies | `/api/companies` | JWT | `GET /public` (—), `GET /me`, `POST /` (superuser), `PUT /` (actualiza geocerca/radius) |
| Employees | `/api/employees` | JWT | CRUD + `GET /dashboard` socket namespace |
| Locations | `/api/locations` | JWT | `POST /` (marcaje + GPS + validación haversine), `GET /:id` |
| Clients | `/api/clients` | JWT | CRUD |
| Permissions | `/api/permissions` | JWT | `GET /:employee_id`, `POST /`, `PUT /:id` (aprobar/rechazar), attachmentUrl |
| Vacations | `/api/vacations` | JWT | igual que permissions |
| Work Orders | `/api/work-orders` | JWT | CRUD + `PATCH /:id/{start,complete,cancel}` |
| Dashboard | `/api/dashboard` | JWT | `GET /summary`, `GET /attendance/today` |
| Notifications | `/api/notifications/register-token` | JWT | pushTokens |
| Audit | `/api/audit-logs` | JWT | append-only |

Realtime: `setupSocketIO` + namespaces `employees` y `locations` (`main.ts:71`), dashboard (`/api/dashboard`).

Ver matriz completa en `ESTADO-DEL-SISTEMA.md`.

---

## Modelo de datos (MongoDB)

Todas las colecciones con `company` son multi-tenant. `company` en `User` es `ObjectId` ref.

| Colección | Claves |
|-----------|--------|
| `users` | username, email (unique), password (select:false), role, company, department, jobTitle, refreshTokenHash |
| `companies` | name, isActive, location{lat,lng}, geofenceRadius (50–2000m) |
| `departments` | name, company |
| `jobTitles` | job_title, department, company |
| `timeControls` | employee, company, date, entrada/descanso/retorno/salida (strings), location |
| `locations` | employee, company, locations[{date,lat,lng,street}] |
| `clients`, `permissions`, `vacations`, `workOrders`, `auditLogs`, `pushTokens` | todas con `company` |

Geocerca: haversine contra `companies.location` + `geofenceRadius`; geocodificación inversa vía Nominatim.

---

## Roles y multi-tenant

**8 códigos canónicos (inglés, single source):**

```
superuser | platform_admin | support | business_owner | admin | supervisor | hr_manager | employee
```

Fuente: `server/src/db/models/user.ts:role` y `server/src/types/models.d.ts:UserRole` — mantener sincronizado con `app/lib/core/auth/role_guards.dart` y `app/lib/core/routing/app_router.dart:redirect`. Eliminados: `viewer`, `editor`, `it`; `manager→supervisor`, `hr→hr_manager` (migración en `server/scripts/migrate-rename-roles.ts`).

Guards: `tenantGuard` / `requireRole(...roles)` / `requireDeptScope` (`server/src/middlewares/tenantGuard.ts`). Supervisor solo opera sobre su `department`. Excepciones sin tenant: `/api/companies/public`, `/api/auth/*`, `/api/health`.

Navegación Flutter: `goRouterProvider` único (`app/lib/core/routing/app_router.dart:10`) bifurca por `isEmployee` vs `isManager` (`business_owner`/`admin`/`supervisor`/`hr_manager`/`platform_admin`/`superuser`). Tres shells: `DesktopShell`, `AdminMobileShell`, `EmployeeMobileShell` — no duplicar rutas entre `desktop_router.dart` y `mobile_router.dart`.

---

## Testing

```bash
# server — Jest ESM (NODE_OPTIONS obligatorio, ts-jest useESM:true)
pnpm test
pnpm test -- src/__tests__/role-guards.test.ts   # un archivo
NODE_OPTIONS=--experimental-vm-modules jest --watch

# app — flutter_test + mocktail
flutter test
flutter test test/role_guards_test.dart
```

No hay CI (`.github/workflows/` vacío) — ejecutar `lint`/`typecheck`/`test` local antes de push.

---

## OpenSpec y contribución

Cambios spec-driven en `openspec/changes/<nombre>/` (`proposal.md` → `design.md` → `tasks.md` + `specs/<cap>/spec.md`). Config en `openspec/config.yaml`.

```bash
# prompts/skills disponibles
ls .opencode/commands/opsx-*.md  .github/prompts/opsx-*.prompt.md
```

Flujo: `opsx-new` → edita `proposal.md` → `opsx-continue` → `design.md`/`tasks.md` → `opsx-apply` → `opsx-archive`. No editar `openspec/specs/` a mano (vacío hasta archivar). Cada feature debe citar `RN-*`/`RF-*` y seguir `Epic → Feature → US → UC → RF → RN → Test` (`docs/refactoring-alignment.md:24`). Terminología oficial: Empresa/Company, Colaborador/Employee, Marcación, Orden de Trabajo, Sucursal.

Commits: **Conventional Commits** (`feat:`, `fix:`, `refactor:` — ver `git log`). Rama activa `01-openspec` → `origin/01-openspec`.

---

## Roadmap / brechas

Ver `docs/refactoring-alignment.md:34` y `ESTADO-DEL-SISTEMA.md:222`. Hechos: `business_owner` único no validado aún (`RN-001` pendiente), modelo de marcación inmutable (`timeControls` → eventos auditados, `RN-005`), invitaciones single-use (`RN-007/008/009`), Expo/RN eliminado (PRD §8.3 Flutter único). Orden sugerido: marcación → invitations → RN-001.

---

## Licencia

MIT — ver `LICENSE`.
