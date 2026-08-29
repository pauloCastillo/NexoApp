# Database Design — RR-HH

**Database:** `project-t2`
**Engine:** MongoDB
**Orm:** Mongoose 9
**Timezone:** `America/La_Paz`

---

## Collections

### 1. `companies`

```javascript
// Companies collection
db.createCollection("companies", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string", description: "company name, unique" },
        inviteCode: { bsonType: "string", description: "auto-generated registration code" },
        isActive: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});
db.companies.createIndex({ name: 1 }, { unique: true });
db.companies.createIndex({ inviteCode: 1 }, { unique: true });
```

### 2. `employees`

```javascript
db.createCollection("employees", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "companyName", "company", "email", "password"],
      properties: {
        _id: { bsonType: "objectId" },
        username: { bsonType: "string" },
        companyName: { bsonType: "string" },
        company: { bsonType: "objectId", description: "ref -> companies" },
        email: { bsonType: "string" },
        jobTitle: { bsonType: "string" },
        password: { bsonType: "string", description: "bcrypt hash, select: false" },
        phone: { bsonType: "string" },
        role: { enum: ["employee", "manager", "admin"] },
        controlTimeID: { bsonType: "objectId", description: "ref -> timeControls" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});
db.employees.createIndex({ email: 1 });
db.employees.createIndex({ company: 1 });
db.employees.createIndex({ company: 1, email: 1 });
```

### 3. `admins`

```javascript
db.createCollection("admins", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password"],
      properties: {
        _id: { bsonType: "objectId" },
        username: { bsonType: "string" },
        email: { bsonType: "string" },
        password: { bsonType: "string", description: "bcrypt hash, select: false" },
        phone: { bsonType: "string" },
        company: { bsonType: ["objectId", "null"], description: "null for superuser, ref -> companies" },
        role: { enum: ["superuser", "admin", "employee"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});
db.admins.createIndex({ email: 1 });
db.admins.createIndex({ company: 1 });
db.admins.createIndex({ role: 1 });
```

### 4. `clients`

```javascript
db.createCollection("clients", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["companyName", "company", "contactName", "contactLastName"],
      properties: {
        _id: { bsonType: "objectId" },
        companyName: { bsonType: "string" },
        company: { bsonType: "objectId", description: "ref -> companies" },
        contactName: { bsonType: "string" },
        contactLastName: { bsonType: "string" },
        email: { bsonType: "string" },
        phone: { bsonType: "string" },
        createdBy: { bsonType: "objectId", description: "ref -> employees" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});
db.clients.createIndex({ company: 1 });
db.clients.createIndex({ company: 1, companyName: 1 });
```

### 5. `jobTitles`

```javascript
db.createCollection("jobTitles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["employee", "company", "job_title", "department"],
      properties: {
        _id: { bsonType: "objectId" },
        employee: { bsonType: "objectId", description: "ref -> employees" },
        company: { bsonType: "objectId", description: "ref -> companies" },
        job_title: { bsonType: "string" },
        department: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});
db.jobTitles.createIndex({ employee: 1 }, { unique: true });
db.jobTitles.createIndex({ company: 1 });
```

### 6. `timeControls`

```javascript
db.createCollection("timeControls", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["company", "date"],
      properties: {
        _id: { bsonType: "objectId" },
        employee: { bsonType: "objectId", description: "ref -> employees" },
        company: { bsonType: "objectId", description: "ref -> companies" },
        date: { bsonType: "date" },
        entrada: { bsonType: "string", description: "HH:mm" },
        descanso: { bsonType: "string", description: "HH:mm" },
        retorno: { bsonType: "string", description: "HH:mm" },
        salida: { bsonType: "string", description: "HH:mm" },
        location: { bsonType: "objectId", description: "ref -> locations" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});
db.timeControls.createIndex({ employee: 1, date: -1 });
db.timeControls.createIndex({ company: 1 });
db.timeControls.createIndex({ company: 1, date: -1 });
```

### 7. `locations`

```javascript
db.createCollection("locations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["company"],
      properties: {
        _id: { bsonType: "objectId" },
        employee: { bsonType: "objectId", description: "ref -> employees" },
        company: { bsonType: "objectId", description: "ref -> companies" },
        locations: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["date", "latitude", "longitude", "street"],
            properties: {
              date: { bsonType: "date" },
              latitude: { bsonType: "double" },
              longitude: { bsonType: "double" },
              street: { bsonType: "string" },
            },
          },
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});
db.locations.createIndex({ employee: 1 });
db.locations.createIndex({ company: 1 });
```

### 8. `vacations`

```javascript
db.createCollection("vacations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["employee", "company", "startDate", "endDate"],
      properties: {
        _id: { bsonType: "objectId" },
        employee: { bsonType: "objectId", description: "ref -> employees" },
        company: { bsonType: "objectId", description: "ref -> companies" },
        startDate: { bsonType: "date" },
        endDate: { bsonType: "date" },
        status: { enum: ["pendiente", "aprobado", "rechazado"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});
db.vacations.createIndex({ employee: 1 });
db.vacations.createIndex({ company: 1, status: 1 });
```

### 9. `permissions`

```javascript
db.createCollection("permissions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["employee", "company", "type", "startDate", "endDate", "reason"],
      properties: {
        _id: { bsonType: "objectId" },
        employee: { bsonType: "objectId", description: "ref -> employees" },
        company: { bsonType: "objectId", description: "ref -> companies" },
        type: { enum: ["permiso", "licencia", "otro"] },
        startDate: { bsonType: "date" },
        endDate: { bsonType: "date" },
        reason: { bsonType: "string" },
        status: { enum: ["pendiente", "aprobado", "rechazado"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});
db.permissions.createIndex({ employee: 1 });
db.permissions.createIndex({ company: 1, status: 1 });
```

### 10. `workOrders`

```javascript
db.createCollection("workOrders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["employee", "company"],
      properties: {
        _id: { bsonType: "objectId" },
        employee: { bsonType: "objectId", description: "ref -> employees" },
        company: { bsonType: "objectId", description: "ref -> companies" },
        client: { bsonType: "objectId", description: "ref -> clients" },
        clientName: { bsonType: "string" },
        location: {
          bsonType: "object",
          properties: {
            latitude: { bsonType: "double" },
            longitude: { bsonType: "double" },
          },
        },
        description: { bsonType: "string" },
        date: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});
db.workOrders.createIndex({ employee: 1 });
db.workOrders.createIndex({ company: 1 });
db.workOrders.createIndex({ client: 1 });
```

---

## Seed Data

### Superuser (admin global, sin company asignada)

```javascript
// Create default company
const company = db.companies.insertOne({
  name: "Default Company",
  inviteCode: "A1B2C3D4",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Create superuser (no company — cross-tenant access)
db.admins.insertOne({
  username: "superadmin",
  email: "admin@system.com",
  password: "<bcrypt_hash_of_secure_password>",
  phone: "",
  company: null,
  role: "superuser",
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

---

## Mongoose Models (resumen)

| Archivo | Modelo | Collection |
|---------|--------|------------|
| `src/db/models/company.ts` | `Company` | `companies` |
| `src/db/models/employee.ts` | `Employee` | `employees` |
| `src/db/models/manager.ts` | `Manager` | `admins` |
| `src/db/models/client.ts` | `Client` | `clients` |
| `src/db/models/jobTitle.ts` | `JobTitle` | `jobTitles` |
| `src/db/models/timeControl.ts` | `ControlTime` | `timeControls` |
| `src/db/models/locations.ts` | `Location` | `locations` |
| `src/db/models/vacation.ts` | `Vacation` | `vacations` |
| `src/db/models/permission.ts` | `Permission` | `permissions` |
| `src/db/models/workOrder.ts` | `WorkOrder` | `workOrders` |
