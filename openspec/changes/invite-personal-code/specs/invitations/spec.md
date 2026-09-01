## ADDED Requirements

### Requirement: Crear invitación personal por tenant
El sistema SHALL permitir a usuarios con rol `business_owner`, `admin`, `hr_manager` o `supervisor` crear una invitación personal con `code` único 8 hex, `company` del JWT, `role` (default `employee`), `department?`, `branch?`, `shift?`, `targetEmail?/targetPhone?`, `maxUses=1`, `expiresAt` (default 7d), `isActive=true`.

#### Scenario: Creación exitosa por admin
- **WHEN** `POST /api/invitations` con token válido y body `{departmentId, targetPhone:"+59177777777"}`
- **THEN** responde `201 {code, company, role, expiresAt, maxUses:1}` y persiste con `createdBy`, y registra `auditLog invitation.created`

#### Scenario: Sin company en token
- **WHEN** token sin `companyId`
- **THEN** responde `400 Empresa no encontrada en token`

### Requirement: Validar invitación (público, throttled)
El sistema SHALL exponer `GET /api/invitations/validate/:code` público, con throttle 10/min/IP, que retorna preview sin enumerar: si no existe/expirado/usado responde `400 {message:"Código inválido o expirado", canRequestNew:true}` unificado.

#### Scenario: Código válido
- **WHEN** `GET /validate/AB12CD34` con código activo y no usado
- **THEN** responde `200 {valid:true, company{name}, department, branch, shift, role, expiresAt}`

#### Scenario: Código usado o expirado
- **WHEN** `GET /validate/XXXX` con código consumido o pasado `expiresAt`
- **THEN** responde `400 {message:"Código inválido o expirado", canRequestNew:true}`

### Requirement: Solicitar nuevo código cuando expiró
El sistema SHALL exponer `POST /api/invitations/request-new {code, email?, phone?}` público que siempre responde `200 {message:"Si el código existe, el administrador fue notificado"}` genérico, crea `auditLog invitation.request_new` y emite notificación a admins de la `company` de la invitación vía socket.

#### Scenario: Empleado solicita nuevo tras 410
- **WHEN** mobile muestra banner expirado y el empleado pulsa "Solicitar nuevo código"
- **THEN** `POST /request-new` responde 200 genérico y desktop del admin recibe evento para regenerar

### Requirement: Listar y revocar por empresa
El sistema SHALL permitir `GET /api/invitations` (lista de isActive de mi company) y `DELETE /api/invitations/:code` (marca `isActive=false`) solo a roles admin-like del tenant.

#### Scenario: Revocación
- **WHEN** `DELETE /ABC123` con código activo de mi empresa
- **THEN** responde `200 {message:"Revocado"}` y posteriores `validate` devuelven 400

### Requirement: Consumo atómico single-use
El sistema SHALL consumir la invitación de forma atómica con `findOneAndUpdate({code, isActive:true, usedCount:{$lt:maxUses}}, {$inc:{usedCount:1}, $set:{usedBy, usedAt, isActive:false}})`; si no matchea, falla como inválido.

#### Scenario: Doble consumo concurrente
- **WHEN** dos registros intentan consumir el mismo código simultáneamente
- **THEN** solo uno succeed, el otro recibe `400 Código inválido o expirado`

### Requirement: Compartir por WhatsApp y QR
El sistema SHALL permitir compartir la invitación vía WhatsApp link `https://wa.me/?text=Únete a {company} en Nexo: https://nexo.app/invite/{code}  Código: {code}` y QR que codifica `nexo://invite/{code}` (generado en client con `qr_flutter` o en server como `qrDataUrl`).

#### Scenario: Admin comparte
- **WHEN** admin crea invitación y pulsa "Compartir WhatsApp" o "Mostrar QR"
- **THEN** se abre `share_plus` con texto/link y se muestra QR escaneable que pre-llena el código en mobile
