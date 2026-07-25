---
title: Global Business Rules
project: Nexo
version: 1.0.0
status: Approved
type: Foundation Specification
last_updated: 2026-07-02
related:
  - overview.md
  - architecture.md
---
# Global Business Rules

- **Aislamiento de datos** — Toda información y todo usuario pertenece a una sola empresa inquilina. Ningún dato debe ser accesible desde otro tenant sin autorización explícita del Superuser de Nexo. Garantiza el modelo multi-tenant y la confidencialidad entre clientes.
- **Control de acceso por roles** — Toda operación debe validar permisos según el rol del usuario. Un Employee no puede ejecutar acciones de Company Admin. Previene escalada de privilegios y operaciones no autorizadas.
- **Trazabilidad de cambios** — Toda modificación, creación o eliminación de datos críticos debe generar un registro de auditoría con timestamp, usuario, acción y valor anterior. Permite reconstruir la línea de tiempo de cualquier evento y cumple con el principio Audit by Default.
- **Multi-tenant en toda funcionalidad** — Todo módulo, feature o API debe soportar aislamiento por empresa inquilina desde su diseño. Impide que una funcionalidad nueva rompa el modelo de datos compartidos.
- **Seguridad en comunicaciones** — Toda comunicación entre servicios debe ser autenticada (JWT o similar) y cifrada en tránsito (TLS). Protege los datos contra intercepción y replay attacks.
- **Geolocalización obligatoria en marcaje** — Todo registro de asistencia debe incluir coordenadas geográficas del colaborador al momento del marcaje. Permite validar presencia en sitio y auditar desviaciones.
- **Pertenencia de datos de clientes** — Los datos de clientes registrados por un Employee pertenecen a la empresa, no al colaborador. La empresa conserva la propiedad aunque el Employee sea dado de baja. Evita pérdida de información comercial por rotación de personal.
- **Integraciones exclusivamente por API** — Toda integración externa debe realizarse exclusivamente a través de las APIs públicas del sistema, nunca accediendo directamente a la base de datos. Mantiene la capa de abstracción y permite versionado controlado.
- **Consistencia temporal** — Todo registro debe incluir un timestamp UTC generado por el servidor. Los relojes del cliente no son fuente de verdad para eventos del sistema. Elimina inconsistencias por diferencias de zona horaria o manipulación del reloj del dispositivo.
- **Portabilidad de datos** — El inquilino debe poder exportar todos sus datos en formato estándar (JSON, CSV o Excel) sin intervención del equipo de Nexo. Garantiza la soberanía del cliente sobre su información y evita vendor lock-in.