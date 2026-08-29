---
id: EPIC-ATT-001
title: Control de Asistencia y Jornada Laboral
product: Nexo
bounded_context:
  - control_asistencia
status: DRAFT
priority: MUST
actors:
  - ACT-005
  - ACT-002
---
# EPIC-ATT-001 — Registrar Marcación

## 1. Problema

Los colaboradores de una empresa deben ingresar a una oficina y marcar la asistencia laboral en la máquina de marcaje, el problema es que cuando un colaborador debe trabajar fuera de la oficina, debe ir a la oficina y realizar su respectivo marcaje y recién salir a su destino laboral, lo cual puede tomar mucho tiempo el movilizarse de un lugar a otro y comenzar su actividad laboral mucho más tarde de lo planeado.

## 2. Objetivo

Proporcionar a las organizaciones un mecanismo confiable para registrar, administrar y supervisar la jornada laboral de sus colaboradores, garantizando la trazabilidad de los eventos laborales y respetando la privacidad de los usuarios.

- Reducir el tiempo dedicado al control manual de asistencia.
- Digitalizar el registro de la jornada laboral.
- Proporcionar información confiable para reportes administrativos.
- Facilitar el cumplimiento de las políticas internas de asistencia.

## 3. Alcance

### **Incluye**

- Marcaje de la entrada, receso, retorno, salida
- El marcaje de la hora de retorno puede ser opcional.
- Historial de marcaciones
- Registro de la ubicación del colaborador
- Generación de órdenes de trabajo
- Gestión de la jornada laboral

### **No Incluye**

- Gestión de asistencia.
- Gestión de vacaciones.
- Gestión de órdenes de trabajo.
- Facturación.
- Gestión operativa de colaboradores.

## 4. Features

|Código|Feature|Prioridad|
|---|---|---|
|FEAT-ATT-001|Registrar Marcación|Must|
|FEAT-ATT-002|Consultar Historial de Marcaciones|Must|
|FEAT-ATT-003|Corrección de Marcaciones|Should|
|FEAT-ATT-004|Registro de Ubicación|Must|
|FEAT-ATT-005|Gestión de Jornada Laboral|Must|

## 5. User Stories 

|ID|User Story|
|---|---|
|ID|User Story|
|US-ATT-001|Registro de Marcación Laboral|
|US-ATT-002|Historial de Marcaciones|
|US-ATT-003|Registro de ubicación|
|US-ATT-004|Registro de órdenes laborales|

## 6. Reglas de Negocio

- RN-ATT-001 — Un colaborador pertenece únicamente a una empresa 
- RN-ATT-002 — Un colaborador solamente puede registrar el marcaje una sola vez
- RN-ATT-003 — El marcaje comienza con la entrada, luego se habilita la opción de marcaje de receso, posteriormente el de retorno y por último el de salida.
- RN-ATT-004 — El marcaje cuenta con una opción de rango de horarios para que un colaborador pueda marcar. Por ejemplo: en el rango entre las 7:30 hrs y las 10:30 hrs puede un colaborador marcar entrada. Entre las 12:00 y las 14:00 hrs. puede un colaborador marcar descanso. Entre las 14:15 y las 16:30 hrs puede un colaborador marcar retorno. Y por último entre las 17:30 y 21:30 hrs puede un colaborador marcar salida.
- RN-ATT-005 — El rango de horarios puede ser modificado por usuario que tenga el bussines_owner (dueño de negocio), supervisor, adminstrador
- RN-ATT-006 — El registro de ubicación del colaborador será exlusivamente dentro de las horas de trabajo señaladas.

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

- Autenticación
- Gestión de Empresas
- Gestión de Usuarios

## 10. Riesgos

- Que el colaborador no quiera aceptar la autorizació de rastreo del dispositivo mientras está en el horario laboral.
- problemas de conexión a internet
- marcaciones repetidas
- problemas de registro con la marcación del colaborador

## 11. Criterios de Finalización

- La epic termina cuando los claboradores puedan registrarse sin problemas.
- Las marcaciones se habiliten en los horarios correspondientes, y solamente se pueda realizar una acción después de otra. Es decir, si yo no registro la entrada, no puedo registrar ningún otro estado como receso, retorno y salida. Esto pasa en cada uno de los estados.
- Al momento de registrar la marcación se debe registrar la ubicación desde el lugar donde se está realizando la acción.
- El encargado de control de la asistencia debe poder verificar dicha marcación en tiempo real desde el dashboard de Nexo desde su máquina de escritorio.
- El 90 % de las marcaciones de asistencia se realizan mediante la plataforma.
- El tiempo promedio para registrar una marcación es inferior a 15 segundos.
- No existen inconsistencias entre la jornada registrada y los reportes administrativos.

## 12. Métricas

- Número de marcaciones registradas.
- Tiempo promedio por marcación.
- Porcentaje de marcaciones exitosas.
- Número de incidencias relacionadas con asistencia.

## 13. Trazabilidad

```
EPIC-ATT-001
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