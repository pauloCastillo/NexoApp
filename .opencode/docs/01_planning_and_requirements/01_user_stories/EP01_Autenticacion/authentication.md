---
id: EPIC-AUTH-001
title: Identidad y Acceso
product: Nexo
bounded_context:
  - Identity
status: DRAFT
priority: MUST
owner: Product
actors:
  - ACT-001
  - ACT-002
  - ACT-005
  - ACT-007
  - ACT-008
---

# EPIC-AUTH-001 — Identidad y Acceso

## 1. Problema

Las organizaciones necesitan controlar de forma segura la identidad y el acceso de las personas que utilizan Nexo, garantizando que cada usuario pueda acceder únicamente a las funcionalidades correspondientes a su organización y rol.

## 2. Objetivo

Proporcionar un sistema centralizado de identidad y acceso que permita registrar, activar y autenticar usuarios, gestionar sus sesiones y controlar sus permisos dentro de las organizaciones correspondientes.

## 3. Alcance

### Incluye

- Registro de usuarios.
- Activación de cuentas.
- Autenticación.
- Gestión de credenciales.
- Gestión de sesiones.
- Autorización basada en roles.
- Asociación entre usuarios y organizaciones.

### No incluye

- Gestión de asistencia.
- Gestión de vacaciones.
- Gestión de órdenes de trabajo.
- Facturación.
- Gestión operativa de colaboradores.

## 4. Features

|ID|Feature|Estado|
|---|---|---|
|FEAT-AUTH-001|Registro de usuarios|DRAFT|
|FEAT-AUTH-002|Autenticación|DRAFT|
|FEAT-AUTH-003|Activación de cuentas|DRAFT|
|FEAT-AUTH-004|Recuperación de credenciales|DRAFT|
|FEAT-AUTH-005|Gestión de sesiones|DRAFT|
|FEAT-AUTH-006|Autorización y acceso|DRAFT|

## 5. User Stories

|   |   |
|---|---|
|ID|User Story|
|US-AUTH-001|Registro del Business Owner|
|US-AUTH-002|Invitación del colaborador|
|US-AUTH-003|Activación de cuenta del colaborador|

Las User Stories deberán mantener trazabilidad con las Features correspondientes.

## 6. Reglas de Negocio

- RN-AUTH-001 — Un email no puede estar asociado a más de una cuenta.
- RN-AUTH-002 — Una cuenta debe mantener un estado válido.
- RN-AUTH-003 — El acceso debe estar asociado a una organización autorizada.
- RN-AUTH-004 — Los permisos deben determinarse de acuerdo con el rol correspondiente.
- RN-AUTH-005 — Las invitaciones deben cumplir las reglas de vigencia y uso definidas.

## 7. Requerimientos Funcionales

Los requerimientos funcionales se documentarán individualmente y deberán mantener trazabilidad con las User Stories, reglas de negocio, casos de uso y pruebas.

## 8. Requerimientos No Funcionales

Aplican principalmente:

- Seguridad.
- Disponibilidad.
- Rendimiento.
- Auditoría.
- Escalabilidad.
- Observabilidad.

## 9. Dependencias

- Servicio de persistencia.
- Servicio de correo electrónico.
- Proveedor OAuth, cuando corresponda.
- Infraestructura de gestión de secretos.
- Sistema de auditoría.

## 10. Riesgos

- Asociación incorrecta de usuarios con organizaciones.
- Acceso no autorizado entre tenants.
- Compromiso de credenciales.
- Errores en la asignación de roles.
- Uso indebido de invitaciones.

## 11. Criterios de Finalización

La Epic podrá considerarse completada cuando:

1. Los usuarios autorizados puedan crear o activar sus cuentas.
2. Los usuarios puedan autenticarse correctamente.
3. Las cuentas estén asociadas a la organización correspondiente.
4. Los roles y permisos se apliquen correctamente.
5. Las sesiones cumplan los requisitos de seguridad.
6. Los escenarios críticos estén cubiertos mediante pruebas automatizadas.
7. No existan defectos críticos o de alta severidad pendientes relacionados con la Epic.

## 12. Métricas de Éxito

- Tasa de registros exitosos.
- Tasa de activaciones exitosas.
- Tasa de errores de autenticación.
- Tiempo promedio de activación.
- Incidencias relacionadas con autenticación y autorización.

## 13. Trazabilidad

```
EPIC-AUTH-001
      ↓
FEATURE
      ↓
USER STORY
      ↓
REQUIREMENT
      ↓
BUSINESS RULE
      ↓
USE CASE
      ↓
ACCEPTANCE CRITERIA
      ↓
TEST
      ↓
IMPLEMENTATION
```