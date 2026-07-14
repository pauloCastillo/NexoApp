---
title: Development Workflow
project: Nexo
version: 1.0.0
status: Approved
type: Foundation Specification
last_updated: 2026-07-02
related:
  - overview.md
  - architecture.md
  - business-rules.md
  - security.md
---

# Development Workflow

## 1. Specification Driven Development (SDD)

Nexo sigue estrictamente el modelo SDD definido en `overview.md`. Ninguna etapa puede saltarse. No existe implementación sin spec aprobada.

```
Idea → Specification → Review → Tasks → Implementation → Tests → Review → Release
```

| Etapa | Responsable | Artefacto | Criterio de salida |
|-------|-------------|-----------|--------------------|
| Idea | Cualquiera | Issue o propuesta | Necesidad documentada |
| Specification | PM / Tech Lead | Archivo `.md` en `specs/` | Spec completa con alcance, reglas, restricciones y acceptance criteria |
| Review | Equipo | Approval en la spec | Aprobación unánime del equipo técnico |
| Tasks | Tech Lead | Issues/checklist en GitHub Projects | Descomposición granular en tareas < 1 día |
| Implementation | Developer | Código + commits | Cumple todos los acceptance criteria |
| Tests | Developer + QA | Suite de tests automatizados | Cobertura > 80% en código nuevo |
| Review | Equipo | Pull request | Aprobación de al menos 1 reviewer |
| Release | Tech Lead | Tag + deploy | Todos los checks verdes |

## 2. Git Workflow

### Ramas

| Rama | Propósito | Origen | Destino |
|------|-----------|--------|---------|
| `main` | Producción. Solo se fusiona desde `release/` o `hotfix/`. | — | — |
| `develop` | Integración continua. Rama base para features. | `main` | `main` |
| `feature/{id}-{nombre}` | Desarrollo de una spec. | `develop` | `develop` |
| `release/v{major}.{minor}.{patch}` | Preparación de release. | `develop` | `main` + `develop` |
| `hotfix/{id}-{descripcion}` | Corrección urgente en producción. | `main` | `main` + `develop` |

### Convención de Commits

```
{tipo}({alcance}): {descripción corta}

Refs: #{issue-id}
```

**Tipos**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`.

**Alcance**: Módulo afectado (`auth`, `employees`, `work-orders`, `api`, `mobile`, `desktop`).

**Ejemplo**:
```
feat(auth): agregar refresh token rotation

Refs: #42
```

### Reglas

- Un commit por unidad lógica de cambio. No commits masivos.
- Todo commit debe referenciar el ID de la spec o issue que lo autoriza.
- No commits directos a `main` ni `develop`. Siempre vía PR.
- `main` está protegida. Solo CI puede fusionar tras checks verdes.

## 3. Pull Request Process

### Requisitos antes de abrir un PR

- [ ] Código pasa linter (ESLint) y typecheck (TypeScript strict).
- [ ] Tests unitarios escritos y pasando.
- [ ] Tests de integración escritos (si aplica).
- [ ] Ningún TODO, `console.log` o código comentado.
- [ ] Variables de entorno documentadas (si se agregaron nuevas).
- [ ] Spec asociada existe y está aprobada.

### Título del PR

```
{id-spec}: {descripción}
```

Ejemplo: `EMP-42: Agregar filtro por departamento en listado de empleados`.

### Revisión

- Mínimo 1 approval de otro miembro del equipo.
- El autor no puede fusionar su propio PR.
- Los cambios solicitados deben resolverse antes del merge.
- PRs de hotfix tienen prioridad y pueden revisarse con 1 approval en < 4h.

### Merge

- `feature/` → `develop`: squash merge.
- `release/` → `main`: merge commit.
- `hotfix/` → `main`: squash merge.
- `main` → `develop` tras release: merge commit (fast-forward).

## 4. Testing Strategy

| Tipo | Herramienta | Cobertura objetivo | Cuándo |
|------|-------------|--------------------|--------|
| Unitario | Vitest / Jest | > 80% código nuevo | Por cada feature |
| Integración | Supertest + MongoDB Memory Server | Endpoints críticos (auth, attendance, work-orders) | Por feature que exponga API |
| E2E (mobile) | Detox / Maestro | Flujos principales (login, marcaje) | Pre-release |
| E2E (desktop) | — | Por definir (MAUI) | Pre-release |

### Reglas

- No se fusiona un PR si los tests nuevos fallan.
- Tests lentos (> 2s) se marcan como `--slow` y se ejecutan en CI por separado.
- Datos de prueba: usar factories (faker + factory pattern), nunca datos reales.

## 5. CI/CD Pipeline

### Pull Request (Checks automáticos)

```
Lint → Typecheck → Unit Tests → Integration Tests → Build → Security Scan
```

### Push a `develop`

```
Lint → Typecheck → Tests → Build → Deploy a Staging
```

### Push a `main` (vía release)

```
Lint → Typecheck → Tests → Build → Security Scan → Deploy a Producción
```

### Herramientas (propuestas)

- **CI**: GitHub Actions
- **Registry**: GitHub Container Registry o Docker Hub
- **Deploy**: Railway / Fly.io (backend), EAS (mobile), MSI installer (desktop)
- **Security**: `npm audit`, `socket.dev` o `snyk` para dependencias

## 6. Entornos

| Entorno | Backend | Mobile | Desktop | Base de datos |
|---------|---------|--------|---------|---------------|
| **Local** | `localhost:3000` | Expo dev | Debug | MongoDB local / Atlas dev |
| **Staging** | `staging.nexo.app` | EAS Internal | — | Atlas staging (dataset anónimo) |
| **Production** | `api.nexo.app` | App Store / Play Store | MSI distribuido | Atlas production |

### Reglas

- Staging usa datos anónimos (sin PII real). Los datos de producción nunca se copian a staging.
- Las credenciales de staging y producción son diferentes. No compartir secrets entre entornos.
- El deploy a producción requiere approval manual del Tech Lead.

## 7. AI Development Workflow

### Principios

- **Las specs son la fuente de verdad**: Toda IA debe leer y comprender las specs del proyecto antes de generar código.
- **Prohibición de inferencia**: La IA no debe inferir, deducir ni completar reglas de negocio ausentes. Las lagunas se reportan como issues.
- **Inmutabilidad arquitectónica**: La IA no puede modificar la arquitectura definida sin una spec de cambio arquitectónico aprobada.
- **Código exclusivamente por Spec**: No se genera código sin una spec aprobada asociada.
- **Trazabilidad bidireccional**: Todo commit generado por IA debe referenciar el ID de la spec que lo autoriza.

### Flujo para IA

1. Leer la spec completa (`specs/{modulo}/{id}.md`).
2. Leer los documentos fundacionales (`overview.md`, `architecture.md`, `business-rules.md`, `security.md`, `development-workflow.md`).
3. Identificar acceptance criteria y reglas de negocio aplicables.
4. Implementar contra la spec sin desviarse.
5. Escribir tests que validen los acceptance criteria.
6. Asegurar que el código pasa linter, typecheck y tests antes del commit.
7. Hacer commit con mensaje que referencie el ID de la spec.

### Prohibiciones explícitas para IA

- No modificar `overview.md`, `architecture.md`, `business-rules.md` ni `development-workflow.md` sin spec aprobada.
- No agregar dependencias sin justificación documentada en la spec.
- No generar código para funcionalidades fuera del alcance de la spec actual.
- No dejar TODOs o FIXMEs en el código. Si algo queda pendiente, crear un issue.

## 8. Code Quality Gates

Antes de cualquier commit, el código debe pasar:

| Gate | Comando | Threshold |
|------|---------|-----------|
| Linter | `npm run lint` | 0 errores, 0 warnings |
| Typecheck | `npm run typecheck` | Strict mode, 0 errors |
| Tests unitarios | `npm run test` | 100% pass |
| Tests integración | `npm run test:integration` | 100% pass |
| Build | `npm run build` | 0 errors |

## 9. Release Process

1. Crear rama `release/v{major}.{minor}.{patch}` desde `develop`.
2. Actualizar versión en `package.json` y archivos de configuración.
3. Ejecutar suite completa de tests.
4. Crear PR de `release/` a `main`.
5. Tras aprobación, fusionar y crear tag `v{major}.{minor}.{patch}`.
6. Deploy a producción.
7. Fusionar `main` de vuelta a `develop`.
8. Actualizar CHANGELOG.

### Versionado Semántico

- **Major**: Cambios incompatibles en API o modelo de datos.
- **Minor**: Nuevas funcionalidades backward-compatible.
- **Patch**: Bug fixes y parches de seguridad.

## 10. Hotfix Process

1. Crear rama `hotfix/{id}-{descripcion}` desde `main`.
2. Implementar la corrección con el mínimo cambio posible.
3. Tests específicos que validen la corrección.
4. Crear PR a `main` con label `hotfix`.
5. Aprobación exprés (1 reviewer, < 4h).
6. Fusionar y taggear `v{major}.{minor}.{patch+1}`.
7. Fusionar `main` en `develop` para no perder el fix.
