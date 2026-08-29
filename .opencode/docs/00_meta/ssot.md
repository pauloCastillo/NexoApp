---
proyecto: Nexo
documento: Single Source Of Truth (SSOT)
version: 1.0
estado: inicial
autor: Paulo Castillo
fecha: 4/08/2026
---
# Single Source Of Truth

## 1. Propósito
Nexo es una plataforma integral de gestión de recursos humanos diseñada para centralizar y digitalizar los procesos administrativos relacionados con la gestión del talento humano. Su propósito es reducir la carga administrativa, mejorar la trazabilidad de los procesos y proporcionar información confiable que facilite la toma de decisiones. 

El enfoque de la plataforma se basa en la confianza entre empleadores y colaboradores, proporcionando herramientas para registrar y dar seguimiento a los procesos laborales únicamente cuando son requeridas para respaldar procesos operativos previamente autorizados por la organización.

La plataforma integra los principales procesos relacionados con la administración del talento humano, desde el control de asistencia y la gestión de las actividades laborales hasta la administración de permisos, vacaciones, comunicación organizacional y la generación de reportes e indicadores para apoyar la toma de decisiones. Su arquitectura modular permitirá incorporar nuevas capacidades conforme evolucionen las necesidades de cada organización, preservando la estabilidad y escalabilidad de la plataforma.

Nexo estará disponible mediante aplicaciones móviles y de escritorio, permitiendo que colaboradores y administradores accedan a las funcionalidades que necesitan según su rol y contexto de trabajo, manteniendo una experiencia consistente entre plataformas.

## 2. Alcance

Nexo, una plataforma de gestión de recursos humanos diseñada para centralizar los procesos administrativos relacionados con el personal de una empresa. Su enfoque se basa en la confianza entre empleadores y colaboradores, proporcionando herramientas de control y seguimiento únicamente cuando son necesarias para la operación del negocio, evitando mecanismos de monitoreo continuo que puedan percibirse como invasivos.

El alcance de este documento comprende las funcionalidades necesarias para la administración de empresas, colaboradores, y su estructura organizacional, así como la gestión de la jornada laboral, órdenes de trabajo, permisos vacaciones, comunicación interna, reportes administrativos y otras características definidas en la [Estrategia del Producto](product_strategy.md)

Asimismo, este PRD establece los requisitos funcionales y no funcionales, los actores involucrados, las restricciones, dependencias y criterios de aceptación que servirán como base para el diseño, desarrollo, pruebas y evolución del producto.

El detalle de las reglas de negocio, especificaciones técnicas, arquitectura, contratos de API, modelo de datos y demás documentos especializados se mantiene en los documentos correspondientes del [Product Specification Kit](product_roadmap.md)

### **Incluye**

- Gestión de empresas y sucursales.
- Gestión de colaboradores
- Gestión de roles y permisos.
- Autenticación y administración de sesiones.
- Control de asistencia y jornada laboral.
- Marcaciones presenciales y remotas.
- Registro de ubicación durante eventos autorizados de marcación.
- Gestión de órdenes de trabajo.
- Gestión de permisos laborales.
- Gestión de vacaciones.
- Comunicación organizacional.
- Gestión de clientes empresariales.
- Facturación de servicios.
- Reportes administrativos e indicadores de gestión.
- Configuración general de la plataforma.
- Requisitos funcionales y no funcionales asociados a cada módulo.
- Diseño de la Arquitectura del Software.
- Diagramas de infraestructura.
- Modelo de Bases de datos.
- Diseño detallado de API.
- Diseño de interfaces de usuario (UX / UI).
- Estrategia de despliegue e infraestructura.

### **No incluye**

- Manuales de usuario.
- Manuales de operación.
- Planes de migración de datos.
- Estrategias de monitoreo y observabilidad.
- Procedimientos de soporte técnico.
- Planificación de versiones y cronogramas de desarrollo, los cuales serán definidos en el Release Plan.

## 3. Principios del SSOT

- Una definición tiene una única fuente oficial.
- Una regla de negocio se documenta una sola vez.
- Todos los módulos deben utilizar la misma terminología.
- Las reglas de negocio prevalecen sobre las decisiones de implementación.
- Toda modificación deberá mantener la trazabilidad con el [[001-Proyectos/Profesionales/001-AppNexo/Desarrollo/01_Proyecto/01_Planificacion_y_Requisitos/PRD_Master|PRD_Master]]] y el [Product Roadmap](product_roadmap.md).

## 4. Definiciones Oficiales

### **Empresa**

Organización registrada en Nexo que utiliza la plataforma para administrar sus procesos de Recursos Humanos.

---

### **Colaborador**

Persona vinculada a una empresa y registrada en la plataforma para desempeñar funciones laborales.

---

### **Business Owner**

Usuario con la máxima autoridad administrativa sobre una empresa dentro de Nexo.

---

### **Marcación**

Registro de un evento relacionado con la jornada laboral de un colaborador, como ingreso, salida, inicio o fin de descanso.

---

### **Orden de Trabajo**

Actividad asignada a uno o más colaboradores para ejecutar una tarea específica con un objetivo, responsable y estado definidos.

---

### **Sucursal**

Unidad organizacional perteneciente a una empresa donde pueden operar colaboradores y registrarse actividades.

---

## 5. Actores Oficiales

| Código | Actor | Descripción |
| ------- | ------ | ------------ |
| ACT-001 | Business Owner o Dueño de Negocio | Responsables principal de la empresa |
| ACT-002| Administrador | Administra las operaciones de la empresa | 
| ACT-003| Supervisor | Gestiona equipos y supervisa actividades | 
| ACT-004| Responsable de RRHH | Gestiona y supervisa el tema de permisos, licencias y vacaciones |
| ACT-005| Empleado | Colaborador oficial de la empresa |
| ACT-006| Cliente Empresarial | Organización o persona jurídica que contrata los servicios ofrecidos por la empresa usuaria de Nexo| 
| ACT-007| Administrador de la Plataforma | Administra las operaciones realizadas en la plataforma NEXO|
| ACT-008| Superuser Nexo | Usuario que tiene control total de la plataforma NEXO |
| ACT-009| Encargado de Soporte | Es el encargado de dar solución a los problemas que existan en la plataforma | 

---

## 6. Reglas de Negocio

| REGLA | DESCRIPCIÓN |
| ------- | --------------- |
| RN-001 | Cada empresa registrada deberá tener exactamente un Business Owner activo o dueño de negocio. |
| RN-002 | Un colaborador pertenecerá únicamente a una empresa. | 
| RN-003 | Toda marcación deberá quedar asociada a un colaborador. |
| RN-004 | La ubicación únicamente podrá registrarse durante eventos autorizados de marcación. |
| RN-005 | Las marcaciones no podrán modificarse directamente; cualquier corrección deberá quedar registrada mediante el proceso de auditoría. | 
| RN-006 | Toda acción relevante deberá registrarse en la bitácora de auditoría. |
| RN-007 | Un colaborador no podrá asociar directamente su cuenta a una organización sin una invitación o mecanismo de autorización previamente generado por la organización.|
| RN-008 | Una invitación debe ser única y tener una vigencia definida. |
| RN-009 | Una invitación utilizada no puede volver a utilizarse. |

## 7. Estados Oficiales

## Estado de una Empresa

- Activa
- Suspendida
- Inactiva

---

## Estado de un Colaborador

- Activo
- Inactivo
- Suspendido

---

## Estado de una Orden de Trabajo

- Pendiente
- Asignada
- En progreso
- Finalizada
- Cancelada

---

## 8. Convenciones

- Todos los identificadores serán únicos.
- Todas las fechas se almacenarán en formato UTC.
- Todos los registros deberán incluir fecha de creación y última actualización.
- Ningún registro será eliminado físicamente sin una política de conservación definida.

---

## 9. Restricciones Globales

- El aislamiento de datos entre empresas (multi-tenant) es obligatorio.
- Los usuarios solo podrán acceder a la información autorizada por su rol y permisos.
- La plataforma deberá garantizar la trazabilidad de las operaciones críticas.
- Ningún módulo podrá contradecir las reglas definidas en este documento.

---

## 10. Trazabilidad

Cada regla de negocio definida en este documento deberá estar referenciada desde:

- Product Requirements Document (PRD)
- Casos de Uso
- Criterios de Aceptación
- Casos de Prueba
- Especificaciones Técnicas
- Documentación de APIs, cuando corresponda.

---

## 11. Historial de Cambios

Toda modificación realizada sobre este documento deberá registrarse indicando:

- Fecha.
- Versión.
- Autor.
- Descripción del cambio.
- Documentos afectados.
