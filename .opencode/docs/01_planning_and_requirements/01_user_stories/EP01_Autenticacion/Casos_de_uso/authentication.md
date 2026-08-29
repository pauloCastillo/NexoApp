---
id: UC-EMP-001
modulo: Identidad y Autenticación
bounded_context: Identity
actor principal: - ACT-001 — Business Owner
actores secundarios: Nexo
user_story: US-EMP-001
Prioridad: MUST
Estado: DRAFT
---

# UC-AUTH-001 — Registrar Business Owner

## 1. Objetivo

Permitir que una persona que no posee una cuenta registrada en Nexo cree una cuenta como Business Owner, para posteriormente acceder a la plataforma y gestionar la organización que representa.

---

## 2. Precondiciones

Para ejecutar este caso de uso:

1. La plataforma Nexo debe estar disponible.
2. La persona no debe tener una cuenta registrada con el email proporcionado.
3. La persona debe proporcionar todos los datos obligatorios definidos para el registro.
4. La información proporcionada debe cumplir las reglas de validación establecidas.

---

## 3. Disparador

El caso de uso se inicia cuando una persona selecciona la opción **"Registrarse como Business Owner"** en Nexo.

---

## 4. Flujo Principal

### **Paso 1 — Inicio del registro**

El usuario selecciona la opción para registrarse como Business Owner.

### **Paso 2 — Presentación del formulario**

El sistema muestra el formulario de registro correspondiente.

### **Paso 3 — Ingreso de información**

El usuario proporciona los datos obligatorios definidos para el registro.

### **Paso 4 — Envío del formulario**

El usuario envía el formulario de registro.

### **Paso 5 — Validación**

El sistema valida que:

- Los campos obligatorios hayan sido proporcionados.
- Los datos cumplan las reglas de validación establecidas.
- El email no se encuentre asociado a una cuenta existente.
- La contraseña cumpla la política de seguridad definida.

### **Paso 6 — Creación de la cuenta**

Si las validaciones son satisfactorias, el sistema crea la cuenta del usuario.

### **Paso 7 — Asignación del rol**

El sistema asigna a la cuenta el rol `business_owner`.

### **Paso 8 — Finalización**

El sistema confirma que la cuenta fue creada correctamente y permite al Business Owner continuar con el proceso de configuración de su organización.

---

## 5. Flujos Alternativos y Excepciones

### FA-001 — Email ya registrado

**Condición:**

El email proporcionado ya está asociado a una cuenta existente.

**Comportamiento:**

1. El sistema detecta que el email ya está registrado.
2. El sistema no crea una nueva cuenta.
3. El sistema informa al usuario que el email ya está registrado.
4. El usuario puede corregir el email o utilizar el proceso correspondiente para acceder a su cuenta existente.

---

### FA-002 — Datos obligatorios incompletos

**Condición:**

Uno o más datos obligatorios no fueron proporcionados.

**Comportamiento:**

1. El sistema detecta los datos faltantes.
2. El sistema no crea la cuenta.
3. El sistema indica los campos que deben ser completados.
4. El usuario completa la información requerida.
5. El usuario puede volver a enviar el formulario.

---

### FA-003 — Contraseña inválida

**Condición:**

La contraseña proporcionada no cumple la política de seguridad definida.

**Comportamiento:**

1. El sistema detecta que la contraseña no cumple los requisitos.
2. El sistema no crea la cuenta.
3. El sistema informa al usuario que la contraseña no cumple la política establecida.
4. El usuario proporciona una contraseña válida.
5. El usuario puede volver a enviar el formulario.

---

## 6. Postcondiciones

### Éxito

Al finalizar correctamente el caso de uso:

- La cuenta del Business Owner existe en Nexo.
- La cuenta tiene asignado el rol `business_owner`.
- La cuenta puede continuar con el proceso de configuración de la organización.
- La operación queda registrada de acuerdo con las políticas de auditoría definidas.

### Fallo

Si el registro no puede completarse:

- No se crea una cuenta inválida.
- La información proporcionada no debe generar una cuenta parcialmente registrada.
- El usuario recibe información suficiente para corregir el problema.

---

## 7. Reglas de Negocio Relacionadas

|   |   |
|---|---|
|ID|Regla|
|RN-IDENT-001|El email utilizado para el registro debe ser único.|
|RN-IDENT-002|El Business Owner debe cumplir la política de seguridad de contraseñas definida por Nexo.|
|RN-IDENT-003|Una cuenta creada mediante este flujo debe recibir el rol `business_owner`.|

> Las reglas anteriores deben mantenerse como referencia al SSOT y no deben definirse exclusivamente dentro de este caso de uso.

---

## 8. Requerimientos Funcionales Relacionados

|   |   |
|---|---|
|ID|Requerimiento|
|RF-IDENT-001|El sistema debe permitir registrar una cuenta de Business Owner.|
|RF-IDENT-002|El sistema debe validar los datos obligatorios del registro.|
|RF-IDENT-003|El sistema debe validar que el email no esté registrado.|
|RF-IDENT-004|El sistema debe validar la política de contraseña.|
|RF-IDENT-005|El sistema debe asignar el rol `business_owner` a la cuenta creada.|

---

## 9. Criterios de Aceptación

Los criterios de aceptación correspondientes se encuentran definidos en:

**US-IDENT-001 — Registro del Business Owner**

Los escenarios deberán mantener trazabilidad con los casos de prueba correspondientes.

---

## 10. Casos de Prueba Relacionados

|   |   |
|---|---|
|ID|Escenario|
|TC-IDENT-001|Registro exitoso|
|TC-IDENT-002|Registro con email ya registrado|
|TC-IDENT-003|Registro con datos obligatorios incompletos|
|TC-IDENT-004|Registro con contraseña inválida|

---

## 11. Trazabilidad

```
EPIC-IDENT-001
       ↓
FEAT-IDENT-001
       ↓
US-IDENT-001
       ↓
UC-IDENT-001
       ↓
RF-IDENT-001 ... RF-IDENT-005
       ↓
RN-IDENT-001 ... RN-IDENT-003
       ↓
TC-IDENT-001 ... TC-IDENT-004
```

---

## 12. Consideraciones

Este caso de uso no define detalles de implementación como:

- Endpoints de API.
- Controladores.
- Servicios.
- Repositorios.
- Colecciones de MongoDB.
- Frameworks.
- Estructura de código.
- Componentes específicos de Flutter.

Estos elementos deberán definirse en las especificaciones técnicas correspondientes.