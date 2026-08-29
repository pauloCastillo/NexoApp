---
tipo: BacklogMaster
proyecto: Nexo
created: 20/08/2026
actualizado:
---

# 🗂️ Mapeo Máster de Épicas

## 📊 Cuadro de Mando de Estado Global

- **Épicas Totales:** 3
- **Épicas en Progreso:** 1
- **Progreso General:** 33%

## 🗺️ Índice de Épicas y Dependencias

### 🔐 EP01: Identidad y Accesos

* **Estado:** 🟡 En Desarrollo
* **Documento de Épica:** [[001-Proyectos/Profesionales/001-AppNexo/Desarrollo/01_Proyecto/01_Planificacion_y_Requisitos/01_user_stories/EP01_Autenticacion/EP01_Overview|EP01_Overview]]
* **PRD Asociado:** [[PRD_Autenticacion]]
* **Dependencias:** Ninguna (Fase inicial)
* **Avance de USs:** 
	* [x] HU-AUTH-01 
	* [ ] HU-AUTH-02 
	* [ ] HU-AUTH-03

### 👥 EP02: Gestión de Empleados

* **Estado:** 🔴 Pendiente
* **Documento de Épica:** [[EP02_Overview]]
* **PRD Asociado:** [[PRD_Empleados]]
* **Dependencias:** Requiere [[EP01_Overview]] (Autenticación y Roles)
* **Avance de HUs:** `[ ] HU-EMP-01` | `[ ] HU-EMP-02`

### ⏱️ EP03: Control de Tiempo y Fichajes

* **Estado:** 🔴 Pendiente
* **Documento de Épica:** [[EP03_Overview]]
* **PRD Asociado:** [[PRD_ControlTiempo]]
* **Dependencias:** Requiere [[EP01_Overview]] y [[EP02_Overview]]
* **Avance de HUs:** `[ ] HU-TIME-01` | `[ ] HU-TIME-02`

---

## 🔗 Matriz de Dependencias y Orden de Ejecución

Para construir el software de forma ordenada sin bloquear desarrollos, la secuencia de ejecución obligatoria es:

1. **Fase 1 (Core):** [[EP01_Overview]] — Sin esta base no existen usuarios ni permisos.
2. **Fase 2 (Entidades Principales):** [[EP02_Overview]] — Crea el concepto de empleados vinculados a usuarios.
3. **Fase 3 (Lógica de Negocio Avanzada):** [[EP03_Overview]] — Asigna fichajes a los empleados creados.

---

## 🤖 Reglas de Contexto para Agentes de IA
1. Antes de iniciar el desarrollo de una Épica, verifica que sus **dependencias** estén marcadas como `🟢 Completado`.
2. Para trabajar en las tareas atómicas, lee directamente las notas vinculadas en cada Épica (ej. `[[HU-AUTH-01_Registro]]`).
3. Al terminar todas las Historias de Usuario de un bloque, actualiza el estado de la Épica a `🟢 Completado` en este archivo.

### Key Takeaways para Estructurar este Archivo

- **Navegación Limpia:** Usa enlaces dobles (`[[EP01_Overview]]`) hacia los archivos específicos de cada Épica en lugar de volcar todo el detalle aquí.
- **Mapeo de Dependencias:** Indicar claramente qué Épica depende de cuál evita que un agente de IA intente programar el módulo de _Fichajes_ antes de tener listo el módulo de _Usuarios_.
- **Status Flags:** Utiliza emojis o estados estándar (`🔴 Pendiente`, `🟡 En Desarrollo`, `🟢 Completado`) para facilitar la lectura visual y las consultas automatizadas.