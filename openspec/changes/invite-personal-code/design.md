## Context

MVP actual ya persiste `Invitation{code, company, createdBy, role, maxUses, usedCount, expiresAt, isActive, TTL}` y expone `POST /invitations`, `GET /validate/:code`, `GET /`, `DELETE` (`invitations.ts:10`). `authService.registerUser` consume código atómico y crea `User{company: inv.company, role: inv.role}` (`authService.ts:67`). Mobile `register_screen.dart:21` valida código y muestra preview. Falta: personal estricto, pre-asignado dept/sucursal/turno, QR/link, expiración real por consumo, “solicitar nuevo”, y password definido por empleado (aclarado en #6).

Stakeholders: admin desktop (crea), empleado mobile (consume), tenantGuard (aislamiento), auditLog.

## Goals / Non-Goals

**Goals:**
- Código 1-persona, 1-uso, expira al registrarse; porta tenant completo (empresa+dept+sucursal+turno+role)
- WhatsApp link + QR opcional, deep link `/invite/:code` con autofill
- Empleado define su password en el registro; código solo autoriza tenant
- Mensaje de expirado → “Solicitar nuevo código” notifica al admin sin enumerar

**Non-Goals:**
- Invite por email automático (SMTP) — solo share manual WhatsApp/QR
- RBAC fino más allá de role enum existente
- Nueva colección Branch/Shift si se puede reusar Department + string label (mantener ponytail)

## Decisions

**D1 — Modelo personal:** `maxUses=1`, `targetEmail?/targetPhone?`, `department?:ObjectId`, `branchId?:ObjectId|string`, `shiftId?:string|ObjectId`, `usedBy?, usedAt?, requestedNewAt?` sobre `invitation.ts:3`. Mantener TTL 7d como fallback pero expiración primaria es `usedCount>=1 → isActive=false`. Alternativa multi-uso descartada (filtración).

**D2 — Sucursal/turno:** Si no existe colección Branch, guardar `branchId` como `string` libre o `Department` con convención `name: "Sucursal - Centro"` y `shiftLabel: string`. Si luego se necesita geo por sucursal, migrar a `Branch` collection. Evita schema nuevo hoy.

**D3 — Consumo atómico:** Reemplazar `findOne + save` por `findOneAndUpdate({code, isActive:true, usedCount:{$lt:maxUses}}, {$inc:{usedCount:1}, $set:{usedBy, usedAt, isActive:false}})`. Evita race de doble consumo.

**D4 — WhatsApp + QR:** Usar `share_plus: ^10.0.2` ya en `pubspec.yaml:22` para `wa.me?text=...` y deep link `https://nexo.app/invite/CODE`. QR generado en client con `qr_flutter` (nueva dep, ~5KB) o en server con `qrcode` y entregado como `qrDataUrl`. Elegimos client para no añadir dep server.

**D5 — Validate throttling + respuesta unificada:** `GET /validate/:code` devuelve siempre `400 {message:"Código inválido o expirado", canRequestNew:true}` para 404/410/used, para evitar enumeración. Añadir `rateLimit: 10/min/IP` middleware.

**D6 — Password:** No generar temp password; `POST /auth/register` con `invitationCode` requiere `password+confirmPassword` del empleado (ya validado en client). Server no cambia hash flow. Mensaje WhatsApp solo lleva código, no password.

**D7 — Solicitar nuevo:** `POST /invitations/request-new {code, email, phone}` público, siempre 200 genérico, crea `AuditLog{action: invitation.request_new}` y emite `socket.io` a `companyId` room para admins (`dashboardSocketService`). No auto-recrea; admin decide.

## Risks / Trade-offs

- **Enumeración / brute-force** → Mitiga con throttle + respuesta genérica + `code` 8 hex (16^8) suficiente para corto plazo; si escala, subir a 12 chars.
- **Race maxUses** → Mitiga con `findOneAndUpdate` atómico.
- **Branch/Shift sin modelo** → Mitiga guardando string label; migración futura a collection sin breaking si se añade ref.
- **Sucursal ambigua** → Mitiga documentando que `department` es el carrier principal; branch como metadata.
- **Sucursal geo no aplicada** → No bloquea check-in; geofence sigue siendo `Company.geofenceRadius` (`company.ts:15`).

## Migration Plan

1. Extender `Invitation` schema con nuevos opcionales (no breaking, existentes siguen válidos)
2. Actualizar `invitations.ts` POST para aceptar nuevos campos + QR, y `validate`/`request-new`
3. Cambiar `authService.registerUser` a consumo atómico + password definido por empleado
4. Mobile: quitar dropdown empresas para colaborador, añadir preview dept/sucursal/turno, QR scan, deep link `/invite/:code`, botón solicitar nuevo
5. Desktop: modal/route ` /employees/invite` con form + QR + WhatsApp share, lista
6. Deploy: sin migración de datos; códigos viejos multi-uso siguen funcionando hasta expirar/TTL

## Open Questions

- ¿Branch = Department o nueva colección `Branch`? Depende de si sucursal necesita geofence propio.
- ¿Deep link host `nexo.app` o custom scheme `nexo://`? `go_router` ya soporta ambos; elegir uno primario.
