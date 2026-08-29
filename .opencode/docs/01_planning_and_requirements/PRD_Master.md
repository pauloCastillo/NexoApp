---
proyecto: Nexo
documento: PRD
version: 1
estado: inicial
autor: Paulo Castillo
fecha: 2026-08-20
descripción: Creación inicial del documento
---
# PRD Master
*** 

## 1. Propósito del Documento

Nexo es una plataforma integral de gestión de recursos humanos diseñada para centralizar y digitalizar los procesos administrativos relacionados con la gestión del talento humano. Su propósito es reducir la carga administrativa, mejorar la trazabilidad de los procesos y proporcionar información confiable que facilite la toma de decisiones. 

El enfoque de la plataforma se basa en la confianza entre empleadores y colaboradores, proporcionando herramientas para registrar y dar seguimiento a los procesos laborales únicamente cuando son requeridas para respaldar procesos operativos previamente autorizados por la organización.

La plataforma integra los principales procesos relacionados con la administración del talento humano, desde el control de asistencia y la gestión de las actividades laborales hasta la administración de permisos, vacaciones, comunicación organizacional y la generación de reportes e indicadores para apoyar la toma de decisiones. Su arquitectura modular permitirá incorporar nuevas capacidades conforme evolucionen las necesidades de cada organización, preservando la estabilidad y escalabilidad de la plataforma.

Nexo estará disponible mediante aplicaciones móviles y de escritorio, permitiendo que colaboradores y administradores accedan a las funcionalidades que necesitan según su rol y contexto de trabajo, manteniendo una experiencia consistente entre plataformas.

## 2. Objetivo

El objetivo de Nexo es ofrecer una plataforma escalable que permita a las organizaciones digitalizar la gestión de recursos humanos mediante procesos confiables, trazables y fáciles de administrar.

- Construir un Producto Mínimo Viable (MVP) estable.
- Validar el producto con empresas reales.
- Obtener retroalimentación continua de los primeros clientes.
- Consolidar los módulos principales de Recursos Humanos.

## 3. Alcance

El alcance de este documento comprende las funcionalidades necesarias para la administración de empresas, colaboradores, y su estructura organizacional, así como la gestión de la jornada laboral, órdenes de trabajo, permisos, vacaciones, comunicación interna, reportes administrativos y otras características definidas en la [Estrategia del Producto](./product_strategy)

Asimismo, este PRD establece los requisitos funcionales y no funcionales, los actores involucrados, las restricciones, dependencias y criterios de aceptación que servirán como base para el diseño, desarrollo, pruebas y evolución del producto.

El detalle de las reglas de negocio, especificaciones técnicas, arquitectura, contratos de API, modelo de datos y demás documentos especializados se mantiene en los documentos correspondientes del [Product Specification Kit](./product_roadmap)

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

### **No incluye**
- Nexo no realizará cálculo de nómina en la versión MVP.
- Diseño de la Arquitectura del Software.
- Diagramas de infraestructura.
- Modelo de Bases de datos.
- Diseño detallado de API.
- Diseño de interfaces de usuario (UX / UI).
- Estrategia de despliegue e infraestructura.
- Manuales de usuario.
- Manuales de operación.
- Planes de migración de datos.
- Estrategias de monitoreo y observabilidad.
- Procedimientos de soporte técnico.
- Planificación de versiones y cronogramas de desarrollo, los cuales serán definidos en el Release Plan.

## 4. Actores

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

## 5. Módulos del Producto

| Código | Módulo | Documento | 
| ------- | -------- | ------------ | 
| MP-001 | Gestión de Empresas | [gestión de empresas y sucursales](empresas_y_sucursales.md)|
| MP-002 | Usuarios | [gestión de usuarios](usuarios.md)|
| MP-003 | Roles y Permisos | [gestión de roles y permisos](roles_y_permisos.md)|
| MP-004 | Autenticación y Adminsitración de Sesiones | [autenticación](001-Proyectos/Profesionales/001-AppNexo/Desarrollo/01_Proyecto/01_Planificacion_y_Requisitos/PRD_Modules/authentication.md) |
| MP-005 | Asistencia | [control de asistencia](001-Proyectos/Profesionales/001-AppNexo/Desarrollo/01_Proyecto/01_Planificacion_y_Requisitos/PRD_Modules/control_asistencia.md) |
| MP-006 | Marcación Presencial y Remota | [marcaciones presenciales y remotas](marcaciones.md) |
| MP-007 | Geolocalización | [registro de geolocalización](ubicaciones.md) |
| MP-008 | Órdenes de Trabajo | [gestión de órdenes de trabajo](ordenes_de_trabajo.md) |
| MP-009 | Permisos Laborales | [gestión de permisos laborales](permisos.md) |
| MP-010 | Vacaciones| [gestión de vacaciones](vacaciones.md) |
| MP-011 | Clientes | [gestión de clientes empresariales](clientes.md) |
| MP-012 | Facturación de Servicios | [facturación de servicios](facturacion.md) |
| MP-013 | Comunicación Organizacional | [gestión de la comunicación organizacional](comunicacion.md) |
| MP-014 | Reportes Administrativos | [reportes administrativos](reportes.md) |
| MP-015 | Configuración General de la Plataforma | [configuración general de la plataforma](configuraciones.md) |

## 6. Requerimientos Funcionales

- [[001-Proyectos/Profesionales/001-AppNexo/Desarrollo/01_Proyecto/01_Planificacion_y_Requisitos/functional_requirements|Requerimientos Funcionales del Proyecto Master]]

## 7. Requerimientos No Funcionales

Los requerimientos no funcionales establecen las características de calidad que deberá cumplir la plataforma Nexo. Estos requisitos complementan los requerimientos funcionales y definen atributos relacionados con seguridad, rendimiento, disponibilidad, escalabilidad, usabilidad y operación del sistema.

### **7.1 Seguridad**

|Código|Requerimiento|
|---|---|
|RNF-SEC-001|Toda comunicación entre las aplicaciones cliente y el backend deberá realizarse mediante HTTPS utilizando TLS 1.3 o superior.|
|RNF-SEC-002|El sistema deberá implementar autenticación mediante JWT y permitir la integración con proveedores OAuth 2.0, como Google.|
|RNF-SEC-003|Las contraseñas deberán almacenarse utilizando algoritmos de hash seguros (por ejemplo, bcrypt o Argon2), sin almacenar contraseñas en texto plano.|
|RNF-SEC-004|Cada solicitud deberá validar la identidad del usuario y sus permisos antes de acceder a cualquier recurso protegido.|
|RNF-SEC-005|El aislamiento de datos entre empresas (multi-tenant) deberá garantizar que ninguna organización pueda acceder a información perteneciente a otra empresa.|

### **7.2 Rendimiento**

|Código|Requerimiento|
|---|---|
|RNF-PERF-001|El tiempo de respuesta de las operaciones críticas no deberá superar los 2 segundos en el 95 % de las solicitudes bajo condiciones normales de operación.|
|RNF-PERF-002|Las consultas de reportes deberán optimizarse para minimizar tiempos de espera y consumo de recursos.|
|RNF-PERF-003|La plataforma deberá soportar múltiples usuarios concurrentes sin degradar significativamente la experiencia de uso.|

### **7.3 Disponibilidad**

|Código|Requerimiento|
|---|---|
|RNF-AVL-001|La plataforma deberá mantener una disponibilidad mínima del 99.5 % mensual, excluyendo mantenimientos programados.|
|RNF-AVL-002|Los mantenimientos programados deberán comunicarse previamente a las empresas afectadas.|

### **7.4 Escalabilidad**

|Código|Requerimiento|
|---|---|
|RNF-SCL-001|La arquitectura deberá permitir incorporar nuevas empresas sin afectar el rendimiento de las ya registradas.|
|RNF-SCL-002|El sistema deberá soportar el crecimiento progresivo de usuarios, sucursales y colaboradores mediante una arquitectura escalable.|

###  **7.5 Auditoría y Trazabilidad**

|Código|Requerimiento|
|---|---|
|RNF-AUD-001|Toda operación crítica deberá registrarse en una bitácora de auditoría.|
|RNF-AUD-002|Cada registro de auditoría deberá almacenar el usuario, fecha y hora, acción realizada y recurso afectado.|
|RNF-AUD-003|Los registros de auditoría no podrán modificarse directamente.|

### **7.6 Usabilidad**

|Código|Requerimiento|
|---|---|
|RNF-USA-001|La interfaz deberá mantener una experiencia de usuario consistente entre las aplicaciones móviles y de escritorio.|
|RNF-USA-002|Las operaciones más frecuentes (por ejemplo, registrar una marcación de asistencia) deberán completarse con el menor número posible de interacciones. Solamente si el rol del usuario es "employee"|
|RNF-USA-003|Los mensajes de error deberán ser claros, comprensibles y orientar al usuario sobre cómo resolver el problema.|
| RNF-USA-004|La aplicación móvil deberá mostrar al usuario que tiene rol "employee" le muestra una interfaz diferente a la de escritorio.|

###  **7.7 Accesibilidad**

|Código|Requerimiento|
|---|---|
|RNF-ACC-001|La interfaz deberá utilizar tamaños de texto y contrastes adecuados para facilitar la lectura.|
|RNF-ACC-002|Todos los controles interactivos deberán ser accesibles mediante teclado en la aplicación de escritorio.|

### **7.8 Compatibilidad**

|Código|Requerimiento|
|---|---|
|RNF-CMP-001|La aplicación móvil deberá ser compatible con las versiones de Android e iOS definidas para el MVP.|
|RNF-CMP-002|La aplicación de escritorio deberá funcionar en los sistemas operativos soportados por Flutter Desktop para el MVP.| 

### **7.9 Observabilidad**

|Código|Requerimiento|
|---|---|
|RNF-OBS-001|Todos los servicios deberán generar registros (logs) estructurados para facilitar el monitoreo y diagnóstico de incidentes.|
|RNF-OBS-002|La plataforma deberá registrar métricas relacionadas con rendimiento, disponibilidad y utilización de recursos.|

### **7.10 Respaldo y Recuperación**

|Código|Requerimiento|
|---|---|
|RNF-BKP-001|La información almacenada deberá contar con mecanismos automáticos de respaldo.|
|RNF-BKP-002|El sistema deberá permitir recuperar la información respaldada en caso de incidentes que comprometan la integridad de los datos.|

### **7.11 Privacidad**

|Código|Requerimiento|
|---|---|
|RNF-PRV-001|La ubicación geográfica únicamente podrá registrarse durante eventos laborales autorizados, como las marcaciones de asistencia, y nunca mediante monitoreo continuo.|
|RNF-PRV-002|El tratamiento de los datos personales deberá respetar las políticas de privacidad definidas por cada organización y la normativa aplicable.|

### **7.12 Mantenibilidad**

|Código|Requerimiento|
|---|---|
|RNF-MNT-001|La plataforma deberá desarrollarse siguiendo una arquitectura modular que facilite la incorporación de nuevas funcionalidades sin afectar los módulos existentes.|
|RNF-MNT-002|Todo componente deberá estar documentado y mantener trazabilidad con el Product Specification Kit y el SSOT.|

## 8. Restricciones

### **8.1. Tecnológicas**

- La Plataforma deberá soportar una arquitectura multi-tenant y BFF, ya que se realizará un desarrollo para mobile y otro para desktop. 
- El backend deberá desarrollarse utilizando: Node.JS, Typescript, Express y Moongose.
- La autenticación utilizará JWT y OAUTH de Google, con sus respectivos Resfresh Token.
- El frontend deberá desarrollarse utilizando Flutter, tanto para mobile como para desktop. 

---

## 9. Dependencias

Las siguientes dependencias corresponden a servicios, tecnologías y componentes externos o internos necesarios para el correcto funcionamiento y desarrollo de Nexo.

|Código|Dependencia|Tipo|Descripción|
|---|---|---|---|
|DEP-001|Servicio de autenticación|Externa|Integración con OAuth 2.0 para el inicio de sesión mediante cuentas de Google.|
|DEP-002|Base de datos|Interna|Disponibilidad y correcto funcionamiento de la base de datos multi-tenant utilizada por la plataforma.|
|DEP-003|Servicio de mapas|Externa|Proveedor de mapas y geocodificación para visualizar y validar la ubicación de las marcaciones remotas.|
|DEP-004|Servicios de notificaciones|Externa|Envío de notificaciones push y correos electrónicos relacionados con eventos del sistema.|
|DEP-005|Servicios de almacenamiento|Interna|Almacenamiento de documentos y archivos adjuntos generados por los diferentes módulos.|
|DEP-006|Sistema Operativo|Externa|Permisos otorgados por Android, iOS, Windows y macOS para acceder a funcionalidades como ubicación y notificaciones.|
|DEP-007|Conectividad a Internet|Externa|Acceso estable a Internet para sincronizar información entre los clientes y el backend.|
|DEP-008|Backend de Nexo|Interna|Disponibilidad de los servicios BFF y APIs que soportan las aplicaciones móviles y de escritorio.|

---

## 10. Supuestos

Los siguientes supuestos representan condiciones que se consideran verdaderas durante la planificación y el desarrollo del producto. Si alguno de ellos deja de cumplirse, será necesario evaluar su impacto sobre el alcance, el cronograma o la arquitectura de la solución.

|Código|Supuesto|
|---|---|
|SUP-001|Las empresas usuarias disponen de acceso a Internet para utilizar la plataforma.|
|SUP-002|Los colaboradores cuentan con dispositivos compatibles con la aplicación móvil.|
|SUP-003|Los usuarios concederán los permisos necesarios para el uso de la ubicación cuando la operación lo requiera.|
|SUP-004|Las organizaciones definirán previamente sus horarios laborales, sucursales, cargos y estructura organizacional.|
|SUP-005|Los responsables de cada empresa administrarán correctamente los usuarios y permisos dentro de la plataforma.|
|SUP-006|Los proveedores de servicios externos (autenticación, mapas y notificaciones) mantendrán una disponibilidad acorde con los niveles de servicio requeridos.|
| SUP-007 | El MVP será implementado inicialmente con un número limitado de empresas piloto para validar las hipótesis del producto antes de una liberación masiva.|

---

## 11. Riesgos

Los siguientes riesgos han sido identificados durante la etapa de definición del producto. Cada uno deberá ser monitoreado y gestionado durante el ciclo de vida del proyecto.

|Código|Riesgo|Probabilidad|Impacto|Estrategia de mitigación|
|---|---|---|---|---|
|RSK-001|Baja adopción del producto por parte de las empresas piloto.|Media|Alta|Mantener comunicación constante con los clientes piloto e incorporar su retroalimentación en cada Release.|
|RSK-002|Resistencia de los colaboradores al uso de la geolocalización.|Media|Alta|Comunicar claramente que la ubicación solo se registra durante eventos laborales autorizados y no existe monitoreo continuo.|
|RSK-003|Cambios frecuentes en los requerimientos durante el desarrollo del MVP.|Alta|Media|Gestionar el alcance mediante el Product Backlog y un proceso formal de control de cambios.|
|RSK-004|Dependencia de servicios externos para autenticación, mapas o notificaciones.|Media|Media|Diseñar la arquitectura con proveedores reemplazables y mecanismos de recuperación ante fallos.|
|RSK-005|Problemas de rendimiento al incrementar el número de empresas registradas.|Baja|Alta|Diseñar la plataforma con arquitectura multi-tenant escalable y realizar pruebas de carga periódicas.|
|RSK-006|Errores en la gestión de permisos y roles que comprometan la seguridad de la información.|Baja|Muy Alta|Implementar controles de autorización, auditoría y pruebas de seguridad antes de cada Release.|
|RSK-007|Pérdida o corrupción de información crítica.|Baja|Muy Alta|Implementar respaldos automáticos, políticas de recuperación y monitoreo continuo de la integridad de los datos.|
|RSK-008|Retrasos en el desarrollo debido a la complejidad de mantener aplicaciones móviles y de escritorio en paralelo.|Media|Alta|Priorizar funcionalidades comunes, reutilizar componentes y coordinar el desarrollo mediante la arquitectura BFF.|

---

## 12. Criterios de Éxito

Los criterios de éxito definen las métricas mediante las cuales se evaluará el cumplimiento de los objetivos del Producto Mínimo Viable (MVP) de Nexo. Estas métricas permitirán determinar si el producto aporta valor a las organizaciones, satisface las necesidades de los usuarios y cumple con los estándares de calidad establecidos.

## 12.1 Objetivos de Negocio

|Código|Objetivo|Indicador de Éxito|Meta|
|---|---|---|---|
|OBJ-001|Digitalizar la gestión de recursos humanos de pequeñas y medianas empresas.|Empresas activas utilizando Nexo.|Al menos 10 empresas durante la fase piloto.|
|OBJ-002|Reducir la carga administrativa relacionada con la gestión del personal.|Tiempo promedio dedicado al registro y seguimiento de asistencia.|Reducción del 50 % respecto al proceso manual.|
|OBJ-003|Validar el modelo de negocio con clientes reales.|Empresas que continúan utilizando la plataforma después de tres meses.|Retención mínima del 80 %.|

---

## 12.2 Adopción del Producto

|Código|Indicador|Meta|
|---|---|---|
|KPI-001|Colaboradores que registran su asistencia mediante la aplicación móvil.|≥ 90 %|
|KPI-002|Administradores que utilizan el panel web al menos una vez por semana.|≥ 80 %|
|KPI-003|Solicitudes de permisos y vacaciones realizadas desde la plataforma.|≥ 90 % del total de solicitudes.|

---

## 12.3 Calidad del Producto

|Código|Indicador|Meta|
|---|---|---|
|KPI-004|Disponibilidad mensual del sistema.|≥ 99.5 %|
|KPI-005|Tiempo promedio de respuesta de las operaciones críticas.|≤ 2 segundos en el 95 % de las solicitudes.|
|KPI-006|Incidentes críticos reportados durante el piloto.|Máximo 2 por mes.|
|KPI-007|Errores que provoquen pérdida de información.|0|

---

## 12.4 Experiencia del Usuario

|Código|Indicador|Meta|
|---|---|---|
|KPI-008|Tiempo promedio para registrar una marcación de asistencia.|≤ 15 segundos.|
|KPI-009|Tiempo promedio para registrar un nuevo colaborador.|≤ 5 minutos.|
|KPI-010|Nivel de satisfacción de los usuarios (CSAT).|≥ 4.5/5|
|KPI-011|Solicitudes de soporte relacionadas con dificultades de uso.|≤ 5 por empresa durante el piloto.|

---

## 12.5 Validación del MVP

Durante la fase piloto se considerará que el MVP ha sido validado cuando se cumplan las siguientes condiciones:

- Al menos 10 empresas utilicen Nexo en un entorno real.
- El 80 % de las empresas piloto continúe utilizando la plataforma después de tres meses.
- El 90 % de las marcaciones de asistencia se registren mediante la plataforma.
- Las funcionalidades principales (asistencia, permisos, vacaciones y órdenes de trabajo) sean utilizadas de forma continua por los usuarios objetivo.
- No existan defectos críticos que impidan la operación diaria del sistema.
- Los usuarios califiquen la experiencia general con una puntuación promedio igual o superior a 4.5 sobre 5.

---

## 12.6 Revisión de los Criterios de Éxito

Los criterios de éxito deberán revisarse al finalizar cada Release del producto. En función de los resultados obtenidos, el Product Owner podrá ajustar las prioridades del Product Roadmap, incorporar nuevas funcionalidades o redefinir las metas del producto para las siguientes versiones.

---

## 13. Trazabilidad

Relación entre:

Epics

↓

Requerimientos

↓

Casos de Uso

↓

SSOT

↓

Testing