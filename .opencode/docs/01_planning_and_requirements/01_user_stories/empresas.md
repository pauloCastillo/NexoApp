---
id: US-EMP-001
title: Registro de la Organización
epic: RF-COMP-001
feature: FEAT-EMP-001
actor:
  id: ACT-001
  name: Business Owner
bounded_context:
  - Identity
priority: MUST
story_points: 6
status: DRAFT
related_requirements:
  - RF-COMP-001
related_business_rules:
  - RN-AUTH-001
  - RN-AUTH-003
related_use_cases:
  - UC-AUTH-001
acceptance_tests:
  - TC-EMP-001
  - TC-EMP-002
  - TC-EMP-003
  - TC-EMP-004
---
## US-EMP-001  — Registro de la Organización

*Como* Business Owner, 
*quiero* registrar mi organización en Nexo, 
*para* poder administrarla y gestionar a sus colaboradores.

### **Criterios de Aceptación**

**Feature:** FEAT-EMP-001 — Registro de la Organización

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