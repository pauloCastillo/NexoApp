---
title: Refactoring Alignment
project: Nexo
version: 1.0.0
status: Draft
type: Foundation Specification
last_updated: 2026-08-12
related:
  - architecture.md
  - business-rules.md
  - development-workflow.md
---

# Refactoring Alignment — Nexo → SSOT

El código del repositorio se construyó antes de que el SSOT fuera la fuente de verdad oficial, por lo que presenta desviaciones de vocabulario, modelo de datos y reglas de negocio. Este documento define la ruta de refactorización para alinear el repo con el SSOT y el PRD, respetando la trazabilidad y las restricciones globales.

## Fuente de verdad

- `~/Documentos/second-brain/001-Proyectos/Profesionales/001-AppNexo/Desarrollo/ssot.md` — reglas de negocio (RN-001…009), actores (ACT-001…009), términos oficiales, estados y restricciones globales.
- Mismo directorio: `PRD.md` (módulos MP-001…015, prefijos RF/RNF, MoSCoW), `modules/`, `epics/`, `stories/`, `use_cases/`.
- El repo NO es la fuente de verdad del producto. Los specs técnicos de este repo viven en `services/server/openspec/`.

## Regla de trazabilidad

Toda feature nueva debe citar sus códigos de regla del SSOT y seguir la cadena:

```
Epic → Feature → User Story → Use Case → RF → RN → Test Case
```

Ningún módulo ni implementación puede contradecir el SSOT. La terminología oficial es: Empresa/Company, Colaborador/Employee, Marcación, Orden de Trabajo, Sucursal.

## Brechas actuales → objetivo

| Dominio | Actual (repo) | SSOT / PRD | Acción |
|---|---|---|---|
| Roles | Enum `superuser, business_owner, manager, editor, viewer, employee, it, hr` (`src/db/models/user.ts`) | ACT-001 Business Owner; rol `business_owner` (nombrado así en stories y use cases) | ✅ Hecho — `owner` renombrado a `business_owner`; migración `pnpm migrate` normaliza datos existentes |
| Terminología | `employee`, `department`, `jobTitle` | Colaborador, Sucursal | Adoptar términos oficiales en modelos, rutas, controllers y documentación |
| Marcación | `timeControls` = documento diario con strings `entrada/descanso/retorno/salida` (`src/db/models/timeControl.ts`) | Marcación = evento de primer nivel, inmutable, registrado y auditado (RN-005); 4 tipos (ingreso, inicio/fin de descanso, salida) | Migrar a modelo de eventos de marcación; las correcciones deben pasar por auditoría, nunca edición directa |
| Business Owner único | No validado | RN-001: exactamente un Business Owner activo por empresa | Aplicar en creación de empresa y en asignación/transferencia del rol |
| Invitaciones | No implementado (menciones a `inviteCode` en `docs/architecture.md` son obsoletas; el campo no existe) | RN-007/8/9: invitación única, con vigencia, single-use | Implementar EPIC-AUTH-001 (invitación → activación de cuenta → asociación a la organización) |
| Ubicación | GPS capturado en cada marcación | RN-004 + RNF-PRV-001: solo en eventos autorizados de marcación, sin monitoreo continuo | Verificar que no exista captura fuera del evento de marcación |
| Frontend mobile | Dos apps: Expo/RN (placeholder) + Flutter (funcional) | PRD §8.3: Flutter para mobile y desktop | ✅ Hecho — Expo/RN removido; Flutter es el único cliente mobile |
| Arquitectura | API única Express | PRD §8.1: BFF (mobile y desktop), multi-tenant obligatorio | (post-MVP) separar interfaces BFF/mobile y BFF/desktop |

## Orden sugerido de trabajo

1. ~~**Roles y terminología**~~ ✅ Hecho — `owner` → `business_owner` + migración de datos + docs.
2. **Modelo de marcación** — migrar `timeControls` a eventos de marcación inmutables + auditoría (RN-005).
3. **Invitation lifecycle** — implementar EPIC-AUTH-001 (RN-007/8/9).
4. **RN-001** — enforcement del Business Owner único por empresa.
5. ~~**Expo/RN**~~ ✅ Hecho — removido; Flutter es el único cliente mobile.

El orden puede ajustarse con `product_roadmap.md` (fuera del repo, misma carpeta del SSOT); consultarlo antes de iniciar un módulo.