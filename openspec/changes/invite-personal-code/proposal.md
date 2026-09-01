## Why

El onboarding actual permite a colaboradores registrarse eligiendo empresa de un dropdown público (`/companies/public`), rompiendo el aislamiento tenant y sin trazabilidad. Para operaciones en campo se necesita un flujo **personal, por código**, que enrole al empleado directamente en el tenant correcto desde su móvil, con datos pre-asignados por el admin y sin exponer otras empresas.

## What Changes

- **Código personal 1-uso** generado en desktop por `business_owner|admin|hr_manager|supervisor`: 8 hex, `maxUses=1`, expira al consumirse (TTL 7d como fallback), atado a `targetEmail/phone` opcional.
- **Pre-asignado:** `company (del JWT) + department + sucursal(branch) + turno(shift) + role` vienen en la invitación; el empleado no elige tenant.
- **Distribución:** WhatsApp primario (link `https://nexo.app/invite/CODE` + texto) y QR opcional (`nexo://invite/CODE`), usando `share_plus` existente.
- **Validación pública** `GET /invitations/validate/:code` con preview empresa/dept/sucursal/turno y respuesta unificada 410 para evitar enumeración; throttling.
- **Expiración = consumo:** al registrarse `usedCount++` atómico + `isActive=false`; si expiró/agotado la UI muestra **"Solicitar nuevo código"** → `POST /invitations/request-new` notifica al admin vía auditLog/socket sin revelar existencia.
- **Password:** colaborador **define su password** en el mismo form de registro; el código solo autoriza el tenant, no reemplaza la credencial. Sin cambios a flujo `business_owner` (sigue creando empresa).

## Capabilities

### New Capabilities
- `invitations`: generación personal por tenant, validación pública throttled, listado/revocación por empresa, solicitud de nuevo código, QR/link y share WhatsApp; incluye modelo `Invitation` y audit

### Modified Capabilities
- `auth`: `POST /auth/register` acepta `invitationCode` (colaborador) y crea `User{company, department, branch, role}` del código; mantiene `companyName` solo para `business_owner`; password lo define el empleado

## Impact

- **Server:** `src/db/models/invitation.ts`, `src/routes/invitations.ts` (auto-mount `/api/invitations`), `src/services/authService.ts`, `src/types/models.d.ts` (IInvitation), posible nueva `Branch/Shift` o reuso `Department`
- **App:** `auth_remote_source.dart`, `auth_repository.dart`, `register_screen.dart` (TextField código + preview + QR/deep link `/invite/:code`, sin dropdown), `desktop invite UI` (form + QR + WhatsApp)
- **Deps:** `share_plus` existente; QR en desktop puede usar `qr_flutter` (nueva) o generar en server con `qrcode`; `hive_flutter` ya usado para prefs
- **Breaking:** `POST /auth/register` para `employee` sin `invitationCode` ahora retorna `400 Código requerido` (antes creaba company por nombre)
