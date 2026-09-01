## ADDED Requirements

### Requirement: Registro de colaborador vía código de invitación con password definido por empleado
El sistema SHALL permitir `POST /api/auth/register` con `{username, email, phone, password, confirmPassword, invitationCode, role?}` para colaborador invitado; valida invitación personal (ver `invitations`), crea `User{company: inv.company, department: inv.department, branch: inv.branch, role: inv.role, company: inv.company}` con `password` provisto por el empleado (hash bcrypt), sin requerir `companyName`.

#### Scenario: Registro invitado exitoso
- **WHEN** `POST /auth/register` con `invitationCode` válido + `password`/`confirmPassword` coincidentes y `email` no existente
- **THEN** responde `201 {user, companyId, token, refreshToken}`, incrementa `usedCount` atómico y marca invitación inactiva, y registra `auditLog auth.register`

#### Scenario: Código inválido/expirado/usado en registro
- **WHEN** `POST /auth/register` con `invitationCode` inválido, expirado o ya consumido
- **THEN** responde `400 Código inválido o expirado`

#### Scenario: Colaborador sin código
- **WHEN** `POST /auth/register` con `role=employee` sin `invitationCode` ni `companyName` válido
- **THEN** responde `400 Código de invitación requerido para colaboradores. Solicítalo a tu administrador.`

#### Scenario: Business_owner sin código (sin cambio)
- **WHEN** `POST /auth/register` con `role=business_owner` + `companyName` + `password`
- **THEN** mantiene flujo existente `registerOwner` creando nueva `Company` y `User business_owner`

### Requirement: Validación de password en registro invitado
El sistema SHALL validar `password` mínimo 6 y `confirmPassword === password`; mensajes en español consistentes con `authService`.

#### Scenario: Password mismatch
- **WHEN** `password != confirmPassword`
- **THEN** responde `400 Las contraseñas no coinciden`
