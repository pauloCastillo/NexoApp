## 1. Modelo y persistencia

- [x] 1.1 Extender `server/src/db/models/invitation.ts` con `targetEmail?`, `targetPhone?`, `department?` (ObjectId Department), `branchId?` (string/ObjectId), `shiftLabel?` (string), `usedBy?`, `usedAt?`, `requestedNewAt?` manteniendo `maxUses=1` default y TTL 7d
- [x] 1.2 Actualizar `server/src/types/models.d.ts` con `IInvitation` extendido y export en `src/db/models/index.ts`
- [x] 1.3 Verificar índice `code` unique + `expiresAt` TTL

## 2. Server — rutas Invitations

- [x] 2.1 Actualizar `POST /api/invitations` para aceptar `targetEmail/phone, departmentId, branchId, shiftId, role, expiresInDays` y retornar `qrDataUrl` opcional
- [x] 2.2 Reescribir `GET /validate/:code` con throttle 10/min/IP y respuesta unificada `400 Código inválido o expirado {canRequestNew:true}`
- [x] 2.3 Crear `POST /api/invitations/request-new {code, email?, phone?}` genérico 200 + `auditLog invitation.request_new` + emit socket a admins de la company
- [x] 2.4 Añadir validación Zod para nuevos campos y tests de enumeración

## 3. Server — consumo en registro

- [x] 3.1 Cambiar `authService.registerUser` a consumo atómico `findOneAndUpdate` con `usedCount<maxUses`, set `usedBy/usedAt/isActive:false`, y mapeo `User{company, department, branch, role: inv.role}`
- [x] 3.2 Mantener `password/confirmPassword` provistos por empleado (sin generar temp), validar min 6 y match, y mensaje `400 Código requerido` para employee sin code
- [x] 3.3 Añadir `auditLog invitation.consumed` y manejo de `branch/shift` string fallback si no hay colección

## 4. App — datasource y routing

- [x] 4.1 Actualizar `auth_remote_source.dart` con `validateInvitation` throttled y `requestNewCode`, y `register` con `invitationCode` + `password` (sin companyName para invitado)
- [x] 4.2 Añadir `GoRoute('/invite/:code')` en `app_router.dart` que pre-llena `register_screen` y dispara validación
- [x] 4.3 Añadir `share_plus` WhatsApp helper `wa.me?text=...` y parser deep link `nexo://invite/CODE`

## 5. Mobile — RegisterScreen

- [x] 5.1 Reemplazar dropdown empresas por TextField código + preview `Empresa · Depto · Sucursal · Turno` read-only + botón validar + estado `validating`
- [x] 5.2 Mantener `password` + `confirmPassword` con `obscureToggle` y validación, y mostrar banner expirado con `[Solicitar nuevo código]` → `POST /request-new`
- [x] 5.3 Integrar QR scan (`mobile_scanner`) opcional y deep link autofill
- [x] 5.4 Añadir tests widget para flujo invite válido/inválido/solicitar

## 6. Desktop — creación y share

- [x] 6.1 Crear pantalla/modal `InviteEmployee` con form `targetEmail/phone, department dropdown, branch, shift, role` + CTA Generar
- [x] 6.2 Mostrar `code + QR (qr_flutter) + Botones Copiar / WhatsApp / Descargar QR` y lista `GET /invitations` con revocar
- [x] 6.3 Notificación socket para `invitation.request_new` en dashboard admin

## 7. Verificación

- [x] 7.1 `pnpm lint && pnpm typecheck` en server, `flutter analyze` en app
- [x] 7.2 Tests: jest para invitation lifecycle (crear→validar→consumir→reusar falla, throttle), flutter test para register invite
- [x] 7.3 QA manual: deep link, QR scan, expirado→solicitar, revocado→400, personal 1-uso race
