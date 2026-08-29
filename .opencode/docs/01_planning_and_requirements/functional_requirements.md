---
tipo: RF_Master
proyecto: Nexo
vesrion: 1.0
prd_asociado: [[001-Proyectos/Profesionales/001-AppNexo/Desarrollo/01_Proyecto/01_Planificacion_y_Requisitos/PRD_Master|PRD_Master]]
ssot_referencia: "[[001-Proyectos/Profesionales/001-AppNexo/Desarrollo/00_Meta/ssot|ssot]]"
---

# Requerimientos Funcionales Master
***
Los requerimientos funcionales describen las capacidades que deberá ofrecer Nexo para satisfacer las necesidades del negocio y de sus usuarios.

Cada requerimiento representa una funcionalidad verificable y trazable, asociada a una Epic y, cuando corresponda, a una Feature específica del producto.

Todos los requerimientos funcionales deberán mantener una relación de trazabilidad con las reglas de negocio definidas en el Single Source of Truth (SSOT), los casos de uso, los criterios de aceptación, los casos de prueba y las especificaciones técnicas correspondientes.

### **Estructura de un Requerimiento Funcional**

Cada requerimiento funcional utilizará la siguiente estructura:

|Campo|Descripción|
|---|---|
|Identificador|Código único del requerimiento.|
|Nombre|Nombre corto y descriptivo.|
|Epic|Epic a la que pertenece.|
|Feature|Feature relacionada.|
|Descripción|Comportamiento esperado del sistema.|
|Actor principal|Usuario que ejecuta la funcionalidad.|
|Prioridad|Must, Should, Could o Won't (MoSCoW).|
|Dependencias|Requisitos previos o módulos relacionados.|
|Reglas de negocio|Referencias al SSOT.|
|Criterios de aceptación|Condiciones para considerar implementado el requerimiento.|
|Referencias|Casos de uso, APIs, diseño, pruebas y otros documentos relacionados.|

### **Nomenclatura de los Códigos**

|Prefijo|Significado|
|---|---|
| RF-COMP | Empresas |
| RF-USER  | Usuarios | 
| RF-AUTH | Autenticación y Administración de Sesiones | 
| RF-ROLYPERM | Roles y Permisos | 
| RF-ATT | Asistencia | 
|RF-MARC | Marcación Laboral Presencial y Remoto | 
| RF-GEO | Geolocalización |
| RF-LABOR | Órdenes de Trabajo |
| RF-PERM | Permisos |
| RF-VACA | Vacaciones|
| RF-CSTMR | Clientes |
| RF-FACT | Facturación |
| RF-COMS | Comunicaciones |
| RF-REPORTS | Reportes |
| RF-CONFGS | Configuración |

| Código | Módulo / Dominio | Documento de Requisito | Subcapacidades Incluidas |
| ------- | -------- | ------------ | ------ |
| RF-COMP | Gestión de Empresas | [RF - Gestión de Empresas y Sucursales](RF_empresas_y_sucursales.md)| Empresas, sucursales, áreas y departamentos.|
| RF-IAM  | Identidad y Accesos | [RF - Identidad y Accesos](RF_identidad_y_accesos.md)| Autenticación (`RF-AUTH`), Usuarios (`RF-USER`), Roles y Permisos (`RF-ROLYPERM`).|
| RF-ATT | Control de Asistencia | [RF - Control de Asistencia](RF_control_asistencia.md)| Fichajes (`RF-MARC`), Geolocalización (`RF-GEO`), Horarios y Turnos. |
| RF-LABOR | Órdenes de Trabajo | [RF - Órdenes de Trabajo](RF_ordenes_laborales.md)| Asignación, estados y seguimiento de tareas/órdenes. |
| RF-TIME | Licencias y Ausencias | [RF -Licencias y Ausencias](RF_licencias_y_ausencias.md)| Solicitud de Vacaciones (`RF-VACA`), Permisos y Ausencias (`RF-PERM`). |
| RF-CSTMR | Gestión de Clientes | [RF - Registro de Clientes](RF_clientes.md)| Directorio de clientes, contactos y contratos. |
| RF-FACT | Facturación y Cobros | [RF- Facturación y Cobros](RF_facturacion.md)| Emisión de facturas, métodos de pago y comprobantes. |
| RF-COMS | Comunicaciones | [RF-Comunicaciones Internas](RF_comunicacion_interna.md)| Notificaciones push, emails y avisos internos. |
| RF-REPORTS | Reportes y Analítica | [RF-Reportes y Analíticas](RF_reportes.md)| Exportación de datos, dashboards ejecutivos y métricas. |
| RF-CONFGS | Configuración Global| [RF-Configuración Global](RF_configuraciones.md)| Parámetros del sistema, integraciones y variables. |