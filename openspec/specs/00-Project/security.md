---
title: Security
project: Nexo
version: 1.0.0
status: Approved
type: Foundation Specification
last_updated: 2026-07-02
related:
  - overview.md
  - architecture.md
  - business-rules.md
---

# Security

## 1. Aislamiento de Tenants

- **Pertenencia**: Toda entidad pertenece exactamente a un tenant (`companyId`). Los datos huérfanos están prohibidos.
- **Filtro en consultas**: Toda consulta a la base de datos debe incluir el identificador del tenant. El aislamiento se aplica en la capa de datos, no solo en la UI.
- **Excepción Superuser**: Solo el rol Superuser de Nexo puede omitir el aislamiento entre tenants, y únicamente con autorización explícita del dueño del tenant.
- **Prohibición de acceso cruzado**: Ningún usuario de un tenant puede acceder a datos de otro tenant. No existe el concepto de compartir datos entre inquilinos.

## 2. Autenticación y Autorización

- **JWT**: Access token (vigencia 24h) + Refresh token (vigencia 7d) con rotación al usarse.
- **Payload JWT**: `{ userId, email, companyId, role, userType }` — nunca incluir secrets ni PII más allá de la identificación.
- **Hash de contraseñas**: bcrypt con 12+ rondas de sal.
- **Cadena de middleware RBAC**:
  - `verifyToken` — valida autenticidad y vigencia del JWT.
  - `requireCompanyAccess` — verifica que el `companyId` del JWT coincida con el recurso solicitado.
  - `requireSuperuser` — restringe al rol Superuser de Nexo.
  - `requireRole(...)` — restringe a uno o más roles específicos.
- **TLS obligatorio**: Toda comunicación debe ir cifrada en tránsito. HTTP es rechazado.
- **Almacenamiento seguro**: Tokens móviles en `expo-secure-store`; tokens de escritorio en `SecureStorage` (Windows Credential Manager / macOS Keychain).

## 3. Validación de Entrada y Sanitización de Salida

- **Validación en boundaries de API**: Todo endpoint valida body, query params y path params usando schemas de Zod.
- **Prevención de inyección NoSQL**: Las consultas de Mongoose nunca interpolan entrada cruda del usuario. Usar consultas parametrizadas y tipado de schemas.
- **Prevención de XSS**: Sanitizar todo contenido generado por el usuario antes de renderizarlo. Nunca confiar en HTML provisto por el cliente.
- **Autoridad del servidor**: Las coordenadas GPS, timestamps y datos reportados por el dispositivo se validan contra reglas del servidor antes de aceptarse. El reloj del cliente nunca se trata como fuente de verdad.

## 4. Trazabilidad de Auditoría

- **Auditoría por Defecto**: Toda operación de creación, actualización o eliminación de datos críticos genera un evento de auditoría inmutable.
- **Registro de auditoría**: `{ timestamp (UTC), userId, companyId, action, entityType, entityId, previousValue, newValue, ipAddress }`.
- **Solo apéndice**: Los logs de auditoría no pueden ser modificados ni eliminados por ningún rol, incluyendo Superuser de Nexo.
- **Eventos auditables**:
  - Autenticación: inicio de sesión, cierre de sesión, intentos fallidos.
  - Cambios de roles y permisos.
  - CRUD de empleados, clientes y órdenes de trabajo.
  - Transiciones de estado en órdenes de trabajo.
  - Marcaje de asistencia (entrada, salida, descanso).
  - Cambios en la configuración del tenant.

## 5. Secrets y Configuración

- **Variables de entorno**: Todos los secrets (URI de BD, JWT secret, API keys) se inyectan mediante variables de entorno, nunca se comprometen al repositorio.
- **Docker**: Sin secrets en Dockerfiles. Usar docker secrets o inyección en tiempo de ejecución.
- **Rotación de claves**: Las claves de firma JWT y los API secrets se rotan periódicamente. Las claves antiguas se retiran tras un período de gracia.
- **Sin secrets en logs**: El logger Pino redacta campos sensibles (`password`, `token`, `secret`, `authorization`) automáticamente.

## 6. Límites de Tasa y Protección contra Abusos

- **Límites por endpoint**: Rate limiting por usuario autenticado y por tenant en conjunto.
- **Fuerza bruta en login**: Retardo progresivo tras 5 intentos fallidos; bloqueo de cuenta tras 15.
- **Límites de paginación**: Tamaño máximo de página definido en todo endpoint de listado para prevenir data scraping.
- **Rotación de refresh token**: Cada refresh invalida el token anterior. La reutilización de un refresh token antiguo es rechazada.

## 7. Cumplimiento Multi-Tenant

- **Formato de identificadores**: Los tenants usan ObjectIds/UUIDs, no enteros secuenciales.
- **Pertenencia del recurso**: Todo endpoint verifica que el `companyId` del JWT coincida con el recurso solicitado.
- **Cumplimiento en capas**: El aislamiento de tenant se aplica en la capa de repositorios, no solo a nivel de controlador o ruta.
- **Consultas a prueba de fallos**: Toda consulta de repositorio que omita `companyId` falla en desarrollo y se bloquea en producción.

## 8. Dependencias y Cadena de Suministro

- **Escaneo de vulnerabilidades**: `npm audit` (o equivalente) se ejecuta en CI en cada build.
- **Versiones fijas**: Las dependencias críticas se fijan a versiones exactas. Los operadores de rango (`^`, `~`) se evitan en producción.
- **Monitoreo de deprecación**: Los paquetes obsoletos o deprecados se marcan para actualización o reemplazo.

## 9. Headers de Seguridad HTTP

- `Strict-Transport-Security`: `max-age=31536000; includeSubDomains`
- `X-Content-Type-Options`: `nosniff`
- `X-Frame-Options`: `DENY`
- `Content-Security-Policy`: restringido a mismo origen y CDNs conocidos.
- `CORS`: lista blanca por origen; modo de credenciales configurado según sensibilidad del endpoint.

## 10. Portabilidad de Datos y Ciclo de Vida del Tenant

- **Exportación**: Cada tenant puede exportar todos sus datos en JSON, CSV o Excel sin intervención de la plataforma.
- **Eliminación**: La baja de un tenant incluye un purge completo de todos sus datos asociados en todas las colecciones.
- **Retención**: Los logs de auditoría se conservan según requisitos legales aplicables; los datos operativos se purgan al eliminar el tenant.

## 11. Respuesta a Incidentes

- **Monitoreo**: Los intentos de autenticación fallidos, picos inusuales de paginación y cambios rápidos de acceso entre tenants disparan alertas.
- **Protocolo de breach**: Ante una breach confirmada, todos los access tokens de los tenants afectados se revocan inmediatamente. Los tenants se notifican en un plazo de 24h.
- **Acceso forense**: Solo Superuser de Nexo puede acceder a los logs de auditoría para investigación, y cada uno de esos accesos es a su vez auditado.
