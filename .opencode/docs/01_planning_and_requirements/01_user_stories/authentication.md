---
id: US-AUTH-001
title: Registro del Business Owner
epic: EPIC-EMP-001
feature: FEAT-AUTH-001
actor:
  id: ACT-001
  name: Business Owner
bounded_context:
  - Identity
priority: MUST
story_points: 6
status: DRAFT
related_requirements:
  - RF-EMP-001
related_business_rules:
  - RN-AUTH-001
  - RN-AUTH-003
related_use_cases:
  - UC-EMP-001
acceptance_tests:
  - TC-EMP-001
  - TC-EMP-002
  - TC-EMP-003
  - TC-EMP-004
---

## US-AUTH-001 — Registro del Dueño de Negocio (Business Owner)

*Como* dueño de negocio (Business Owner), 
*quiero* poder registrar mi cuenta en Nexo,
*para*  acceder a Nexo y gestionar la organización que representa

### **Criterios de Aceptación**

**Feature:** FEAT-AUTH-001 — Registro del dueño de negocio (Business Owner)

**Scenario:** Registro Exitoso
	Given que la persona no tiene una cuenta registrada en Nexo,
	When proporciona todos los datos obligatorios definidos para el registro
	And envía el formulario de registro 
	Then el sistema debe crear su cuenta
	And debe asignarle el rol de "business_owner"
	And debe permitirle continuar con la configuración de su organización

**Scenario:** Registro con email ya registrado 
	Given que ya existe una cuenta registrada con el email proporcionado 
	When la persona envía el formulario de registro 
	Then el sistema debe rechazar el registro 
	And debe informar que el email ya está registrado

**Scenario:** Registro con datos obligatorios incompletos 
	Given que la persona no ha proporcionado uno o más datos obligatorios definidos en RF-EMP-001
	When intenta enviar el formulario 
	Then el sistema debe rechazar el registro 
	And debe indicar los datos que deben ser completados

**Scenario:** Registro con contraseña inválida 
	Given que la persona proporciona una contraseña que no cumple la política de seguridad 
	When envía el formulario 
	Then el sistema debe rechazar el registro 
	And debe informar que la contraseña no cumple los requisitos establecidos

### **Story Points:** 6
---

## US-AUTH-002  —Activación de cuenta del colaborador

*Como* colaborador de una organización, 
*quiero* registrar mi cuenta en Nexo y asociarla a la organización a la que pertenezco, 
*para* poder acceder a las funcionalidades habilitadas para mi rol dentro de la organización.

### **Criterios de Aceptación**

**Feature:** FEAT-AUTH-002 — Activación de cuenta del colaborador

**Scenario:** Activación Exitosa
	Given que el encargado de la organización ha registrado a un colaborador en Nexo
	And existe una invitación válida asociada al colaborador 
	When el colaborador utiliza la invitación y proporciona los datos requeridos
	Then Nexo debe validar la invitación
	And debe activar la cuenta del colaborador 
	And debe asignarle el rol definido para el colaborador
	And debe permitirle acceder a las funcionalidades habilitadas para su rol.

### **Story Points:** 8
---

## US-AUTH-003  — Invitar colaborador

*Como* colaborador de una organización, 
*quiero* registrar mi cuenta en Nexo y asociarla a la organización a la que pertenezco, 
*para* poder acceder a las funcionalidades habilitadas para mi rol dentro de la organización.

### **Criterios de Aceptación**

**Feature:** FEAT-AUTH-003 — Invitación a un colaborador

**Scenario:** Invitación Exitosa
	Given que el encargado tiene autorización para registrar colaboradores 
	When registra correctamente los datos requeridos del colaborador 
	Then Nexo debe crear el registro del colaborador 
	And debe generar una invitación única para la activación de su cuenta 
	And debe asociar la invitación a la organización correspondiente 
	And debe establecer una fecha de expiración para la invitación.

### **Story Points:** 8
---


