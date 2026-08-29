# AGENTS.md — NexoApp

> SSOT is outside the repo: `/home/pollomonroy/Documentos/work/clients/pauloCastillo/projects/NexoApp/.opencode/docs/00_meta/ssot.md` + `/home/pollomonroy/Documentos/work/clients/pauloCastillo/projects/NexoApp/.opencode/docs/01_planning_and_requirements/PRD_Master.md`. Repo specs live in `openspec/`. See `docs/refactoring-alignment.md` for current gaps (RN-001, RN-005, invitations).

## Structure

- `server/` — Express 5 + TypeScript (NodeNext/ESM) + Mongoose + Socket.io + Zod + Pino. Entrypoint `server/main.ts`, routes auto-mounted from `server/src/routes/*.ts`.
- `app/` — **Single Flutter codebase** for mobile + desktop (Riverpod, go_router, dio, hive, geolocator, flutter_map). Entrypoints `lib/main_mobile.dart` / `lib/main_desktop.dart` (`lib/main.dart` re-exports). Shells: `lib/presentation/desktop/shells/` + `lib/presentation/mobile/shells/` (AdminMobileShell / EmployeeMobileShell).
- `openspec/` — spec-driven changes: `openspec/changes/<name>/` (`proposal.md`, `design.md`, `tasks.md`, `specs/<cap>/spec.md`). Config `openspec/config.yaml`.
- `.opencode/docs/` — mirrored PRD/SSOT, user stories, RF/RNF, `ESTADO-DEL-SISTEMA.md` (arch overview). Do not treat as source of truth if it conflicts with SSOT file.
- No root `package.json`. `server/` and `app/` are independent; no pnpm workspace at root.

## Commands

**Server** — run from `server/`, requires `pnpm`, Node `>=22.14.0`:
```bash
pnpm install
pnpm dev          # tsx watch main.ts — needs server/.env (DB_URI, JWT_SECRET_KEY, DEV_STATUS)
pnpm lint         # eslint src/ main.ts
pnpm typecheck    # tsc --noEmit
pnpm test         # NODE_OPTIONS=--experimental-vm-modules jest — testMatch **/__tests__/**/*.test.ts
pnpm migrate      # tsx scripts/migrate-rename-owner-role.ts (also scripts/migrate-rename-roles.ts for 8-role migration)
pnpm build && pnpm start  # tsc → node dist/main.js
```
Order: `lint -> typecheck -> test`. `nodemon.json` watches `src/` (not used by `pnpm dev`).

**App** — run from `app/`:
```bash
flutter pub get
flutter analyze
flutter test
flutter run -t lib/main_mobile.dart    # mobile
flutter run -t lib/main_desktop.dart   # desktop
flutter build apk --flavor mobile -t lib/main_mobile.dart
```
Env: `app/.env` contains `API_URL=http://<host>:8080/api` (hard-coded IP — update per env).

## Conventions

- **Conventional Commits** observed in log: `feat:`, `fix:`, `refactor:` (e.g. `refactor: reestructura monorepo a app/server…`). Use `type(scope): subject`.
- **Imports (server):** `NodeNext` ESM — always use `.js` extension in imports (`@/routes/index.js`, `@/db/models/index.js`). Paths: `@/*` → `src/*`, `~~/*` → `./*` (`server/tsconfig.json:17`).
- **Routes (server):** `src/routes/index.ts:12` reads `src/routes/` dir and mounts each file as `/api/<filename>` (without extension). Adding `src/routes/foo.ts` auto-exposes `/api/foo`. Exclude `index.ts` itself.
- **Roles (8 codes, English, single source):** `superuser | platform_admin | support | business_owner | admin | supervisor | hr_manager | employee` — enum in `server/src/db/models/user.ts:role` and `server/src/types/models.d.ts:UserRole`. Keep in sync with `app/lib/core/auth/role_guards.dart` + `app/lib/core/routing/app_router.dart:redirect`. Removed: `viewer`, `editor`, `it`, `manager`→`supervisor`, `hr`→`hr_manager`.
- **Multi-tenant:** `tenantGuard`/`requireRole`/`requireDeptScope` in `server/src/middlewares/tenantGuard.ts` — every request needs `company` from JWT (except `/api/companies/public`, `/api/auth/*`, `/api/health`). `company` is `ObjectId` ref in User.
- **OpenSpec workflow:** create change with `opsx-new` → `proposal.md` → `design.md` → `tasks.md`; use prompts in `.github/prompts/opsx-*.prompt.md` and skills in `.opencode/skills/` / `.github/skills/`. Archive via `opsx-archive`. Don't hand-edit `openspec/specs/` (empty until changes land).
- **Trazabilidad:** every feature must cite `RN-*`/`RF-*` and follow `Epic → Feature → US → UC → RF → RN → Test` (`docs/refactoring-alignment.md:24`). Terminology: Empresa/Company, Colaborador/Employee, Marcación, Orden de Trabajo, Sucursal.

## Gotchas

- `DEV_STATUS=development` in `server/.env` uses HTTP (`createHttpServer`) and skips rate-limit + HTTPS; prod reads `SSL_KEY`/`SSL_CERT` via `fs.readFileSync` — will crash if missing (`server/main.ts:64`).
- Jest ESM: `NODE_OPTIONS=--experimental-vm-modules` is mandatory; `ts-jest` with `useESM:true` and `moduleNameMapper` for `@/*.js` (`server/package.json:65`).
- `server/vendors/xlsx-0.20.2.tgz` is a vendored dep via `file:` — don't replace with registry version without testing `reportService`.
- `app/build/`, `.dart_tool/`, `server/dist/`, `server/node_modules/` are gitignored — never commit.
- `go_router` has single `goRouterProvider` (`app/lib/core/routing/app_router.dart:10`) branching on `isEmployee` vs `isManager` — desktop and mobile routes are merged; `desktop_router.dart` / `mobile_router.dart` must not duplicate paths.
- Migrations are not auto-run. After role renames, run `pnpm migrate` manually; check `server/scripts/migrate-*.ts`.
- No CI workflows (`.github/workflows/` empty) — run lint/typecheck/test locally before push. Current branch `01-openspec` tracks `origin/01-openspec`.
