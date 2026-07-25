# Arquitectura de Software — App de Control Horario y Asistencia (estilo Jibble)

## 1. Alcance y requisitos

**Funcionales clave**
- Clock in/out (con geolocalización y geofencing)
- Timesheets, horarios/turnos, aprobaciones
- Reportes y exportación (PDF/Excel)
- Notificaciones (recordatorios, aprobaciones)
- Multi-tenant (empresas → equipos → empleados), roles y permisos
- Clientes: apps móviles (iOS/Android), app de escritorio (Win/Mac/Linux), web

**No funcionales**
- Alta disponibilidad (99.95%+)
- Baja latencia en clock in/out (<300ms p95)
- Escalable hasta ~1M usuarios concurrentes
- Multi-tenant seguro (aislamiento de datos por empresa)
- Auditable (cada evento de tiempo es inmutable)

---

## 2. Principios arquitectónicos aplicados

Siguiendo Clean Architecture (Robert C. Martin) y Clean Code:

- **Independencia de frameworks**: la lógica de negocio (dominio) no conoce Express, Spring, Room, etc.
- **Regla de dependencia**: las capas externas dependen de las internas, nunca al revés.
- **Testeable**: casos de uso testeables sin UI, DB ni red.
- **Independencia de UI/DB**: se puede cambiar PostgreSQL por otra DB, o Web por Flutter, sin tocar el dominio.
- **Screaming architecture**: la estructura de carpetas grita "control de asistencia", no "Express app".

### Capas (por servicio)

```
┌─────────────────────────────────────────────────────────┐
│  Frameworks & Drivers                                    │
│  (REST/gRPC controllers, ORM, colas, UI, DB drivers)      │
│  ┌───────────────────────────────────────────────────┐   │
│  │ Interface Adapters                                 │   │
│  │ (Controllers, Presenters, Gateways, Repositories)   │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │ Application / Use Cases                      │   │  │
│  │  │ (ClockIn, ApproveTimesheet, GenerateReport)  │   │  │
│  │  │  ┌───────────────────────────────────────┐   │  │  │
│  │  │  │ Entities (Domain)                     │   │  │  │
│  │  │  │ Employee, Shift, TimeEntry, Policy    │   │  │  │
│  │  │  └───────────────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

Ejemplo de carpetas para el servicio **time-tracking**:

```
time-tracking-service/
├── domain/
│   ├── entities/ (TimeEntry, Employee, GeoFence, Shift)
│   ├── value-objects/ (Coordinates, Duration, TimeWindow)
│   └── policies/ (OvertimeRule, RoundingPolicy)
├── application/
│   ├── use-cases/ (ClockInUseCase, ClockOutUseCase, ApproveTimesheetUseCase)
│   └── ports/ (TimeEntryRepository, GeoFenceValidator, NotificationPort) [interfaces]
├── adapters/
│   ├── controllers/ (HttpTimeEntryController, GrpcTimeEntryController)
│   ├── repositories/ (PostgresTimeEntryRepository)
│   └── gateways/ (KafkaEventPublisher, RedisCacheGateway)
└── infrastructure/
    ├── db/ (migrations, ORM config)
    ├── messaging/ (Kafka config)
    └── config/ (env, DI container)
```

---

## 3. Diagrama de componentes (alto nivel)

```
                        ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
                        │  App Móvil   │   │ App Escritorio│  │   App Web    │
                        │(iOS/Android) │   │(Electron/Tauri)│  │  (React)     │
                        └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
                               │                   │                  │
                               └─────────┬─────────┴─────────┬────────┘
                                         ▼                   ▼
                              ┌────────────────────────────────────┐
                              │      CDN / Edge (Cloudflare)        │
                              └───────────────┬──────────────────--─┘
                                              ▼
                              ┌────────────────────────────────────┐
                              │   API Gateway (Kong / Envoy)        │
                              │   - AuthN/AuthZ (JWT/OIDC)          │
                              │   - Rate limiting / Throttling      │
                              │   - Routing                         │
                              └───────────────┬──────────────────--─┘
                                              ▼
        ┌───────────────┬────────────────┬───────────────┬────────────────┬───────────────┐
        ▼               ▼                ▼                ▼                ▼               ▼
 ┌────────────┐ ┌──────────────┐ ┌───────────────┐ ┌──────────────┐ ┌───────────┐ ┌───────────────┐
 │   Auth &   │ │Time-Tracking │ │  Scheduling &  │ │  Reporting & │ │Notification│ │  Billing &    │
 │ Identity   │ │  Service     │ │  Shifts Svc    │ │  Analytics   │ │  Service   │ │  Subscriptions│
 │ Service    │ │ (Clock in/out│ │                │ │  Service     │ │            │ │  Service      │
 │            │ │ + Geofencing)│ │                │ │              │ │            │ │               │
 └─────┬──────┘ └──────┬───────┘ └───────┬────────┘ └──────┬───────┘ └─────┬─────┘ └───────┬───────┘
       │               │                 │                 │              │               │
       ▼               ▼                 ▼                 ▼              ▼               ▼
 ┌────────────┐ ┌──────────────────────────────────────────────────────────────────────────────┐
 │  Keycloak  │ │        Message Broker (Kafka) — eventos: TimeEntryCreated, ShiftAssigned...     │
 │  (OIDC)    │ └──────────────────────────────────────────────────────────────────────────────┘
 └────────────┘               │                 │                 │              │
                               ▼                 ▼                 ▼              ▼
                       ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ ┌───────────┐
                       │ PostgreSQL   │  │ PostgreSQL   │  │ ClickHouse / │ │ Redis      │
                       │ (Time entries│  │ (Shifts)     │  │ TimescaleDB  │ │ (push queue│
                       │  sharded)    │  │              │  │ (analytics)  │ │  + cache)  │
                       └──────────────┘  └──────────────┘  └──────────────┘ └───────────┘
                               │
                               ▼
                       ┌──────────────┐
                       │  S3 / Blob   │
                       │ (fotos clock │
                       │  in, exports)│
                       └──────────────┘
```

**Cross-cutting**: Observability (Prometheus + Grafana + OpenTelemetry + Loki), Service Mesh (Istio/Linkerd) para mTLS y circuit breaking, Feature flags (LaunchDarkly/Unleash).

---

## 4. Tecnologías recomendadas

| Capa | Tecnología sugerida | Motivo |
|---|---|---|
| Mobile | **Flutter** (o React Native) | Un solo codebase iOS/Android, buen soporte offline y geolocalización |
| Desktop | **Flutter** | Reusa componentes web, reduce costo de mantenimiento |
| Web | **React + TypeScript** | Ecosistema maduro, tipado fuerte |
| API Gateway | **Kong** o **Envoy** | Rate limiting, auth centralizada, plugins |
| Backend services | **Go** (servicios de alto throughput como clock-in) + **Node.js/NestJS** (servicios CRUD, dashboards) | Go para baja latencia y concurrencia; Nest para velocidad de desarrollo y Clean Architecture "out of the box" |
| Comunicación interna | **gRPC** entre servicios, **REST** hacia clientes | Eficiencia y contratos tipados |
| Mensajería/eventos | **Kafka** | Alto throughput, replay de eventos, desacopla servicios |
| Base de datos transaccional | **PostgreSQL** (particionado/sharding) | ACID, fuerte para timesheets y aprobaciones |
| Series de tiempo/analítica | **TimescaleDB** o **ClickHouse** | Consultas agregadas rápidas sobre millones de eventos de tiempo |
| Cache | **Redis** | Sesiones, geofences activas, rate limiting distribuido |
| Búsqueda | **Elasticsearch/OpenSearch** | Búsqueda de empleados, logs |
| Almacenamiento de archivos | **S3 / GCS** | Fotos de clock-in, exportes PDF/Excel |
| Auth | **Keycloak (OIDC/OAuth2)** | SSO, multi-tenant, políticas de roles |
| Orquestación | **Kubernetes (EKS/GKE)** | Autoescalado, despliegue multi-región |
| IaC | **Terraform** | Reproducibilidad de infraestructura |
| Observabilidad | **OpenTelemetry + Prometheus + Grafana + Loki** | Trazabilidad distribuida |
| CI/CD | **GitHub Actions + ArgoCD (GitOps)** | Despliegues progresivos (canary/blue-green) |

---

## 5. Estrategia de almacenamiento de datos

1. **Multi-tenancy**: modelo híbrido.
   - Empresas pequeñas/medianas: esquema compartido con `tenant_id` + Row-Level Security en PostgreSQL.
   - Empresas grandes (enterprise): base de datos dedicada o esquema dedicado, para aislamiento y cumplimiento.

2. **Particionado y sharding**:
   - Tabla `time_entries` particionada por rango de fecha (mensual) y shardeada por `tenant_id` (hash) para distribuir carga de escritura.
   - Uso de **Citus** (extensión de PostgreSQL) o servicio gestionado tipo CockroachDB si se requiere sharding automático transparente.

3. **CQRS + Event Sourcing parcial**:
   - Los eventos de dominio (`ClockedIn`, `ClockedOut`, `ShiftApproved`) se publican en Kafka como fuente de verdad append-only.
   - El modelo de escritura (Postgres) se actualiza vía consumidores idempotentes.
   - El modelo de lectura para reportes/analítica se proyecta hacia ClickHouse/TimescaleDB (optimizado para agregaciones), desacoplado del tráfico transaccional.

4. **Cache en capas**:
   - Redis para geofences activas, sesiones y resultados de dashboards frecuentes (TTL corto).
   - CDN para assets estáticos y exportes generados.

5. **Hot/cold storage**:
   - Datos de los últimos 90 días en almacenamiento "caliente" (SSD, réplicas rápidas).
   - Datos históricos movidos a almacenamiento "frío" (S3 + Parquet, consultable con Athena/BigQuery) para reducir costo.

6. **Backups y DR**: snapshots continuos (WAL archiving), réplicas en al menos 2 regiones, RPO < 5 min, RTO < 30 min.

---

## 6. Escalabilidad hasta 1 millón de usuarios concurrentes

**Principio general**: todo servicio de aplicación debe ser **stateless** para escalar horizontalmente sin límite práctico; el estado vive en DB/cache/broker.

- **Autoescalado horizontal**: Kubernetes HPA basado en CPU, latencia y profundidad de cola de Kafka. Servicios críticos (time-tracking) con mínimo de réplicas altas y "warm pools" para absorber picos (ej. inicio de jornada laboral 8-9am en cada zona horaria).
- **Desacople vía colas**: el clock-in no escribe síncronamente en la DB relacional en el camino crítico; se valida (geofence, políticas) y se publica un evento en Kafka con ack rápido al cliente; el consumidor persiste de forma asíncrona con idempotencia (deduplicación por `event_id`).
- **Particionamiento por geografía/tenant**: Kafka topics particionados por `tenant_id` para paralelizar consumo sin perder orden por empresa.
- **Base de datos**: sharding horizontal (Citus/CockroachDB) + réplicas de lectura para dashboards/reportes, separando tráfico de escritura (clock-in) del de lectura (reportes pesados).
- **Multi-región activa-activa**: despliegue en al menos 3 regiones con enrutamiento por latencia (GeoDNS/Anycast), replicación asíncrona entre regiones y resolución de conflictos por `last-write-wins` + reloj lógico (o CRDTs para geofences).
- **Edge computing para geofencing**: validación de geocerca puede resolverse en el dispositivo/edge (Cloudflare Workers) para reducir round-trips, sincronizando reglas de geofence localmente con cache.
- **WebSockets/push a escala**: para notificaciones en tiempo real, usar un servicio dedicado (ej. basado en Redis Pub/Sub + fan-out por shards de conexión, o un proveedor gestionado como Pusher/Ably) en lugar de mantener sockets en los mismos pods que la API REST.
- **Rate limiting y backpressure**: límites por tenant en el API Gateway para evitar que un cliente ruidoso degrade el servicio a otros (aislamiento "noisy neighbor").
- **Circuit breakers y bulkheads**: vía service mesh (Istio) para evitar cascadas de fallos entre microservicios.
- **Pruebas de carga continuas**: k6/Gatling en pipeline de CI para validar que cada release soporta el SLA objetivo antes de producción.
- **Capacity planning**: dimensionar asumiendo distribución no uniforme (picos por zona horaria); 1M usuarios concurrentes no implica 1M clock-ins simultáneos exactos, pero el diseño de colas y autoescalado debe soportar ráfagas de decenas de miles de eventos/segundo en ventanas cortas.

---

## 7. Seguridad y cumplimiento

- OAuth2/OIDC con Keycloak, MFA opcional, tokens de corta duración + refresh rotativo.
- Cifrado en tránsito (mTLS interno vía service mesh, TLS 1.3 externo) y en reposo (KMS).
- Row-Level Security por tenant en PostgreSQL.
- Auditoría inmutable de eventos (append-only log en Kafka + almacenamiento en S3 con object lock).
- Cumplimiento GDPR/CCPA: derecho al olvido implementado como proceso asíncrono que anonimiza `TimeEntry` conservando agregados legales de nómina si aplica.

---

## 8. Resumen de decisiones clave

| Decisión | Alternativa considerada | Por qué esta opción |
|---|---|---|
| Microservicios + Clean Architecture por servicio | Monolito modular | Escalado independiente del servicio crítico (time-tracking) sin arrastrar todo el sistema |
| Kafka como *source of truth* de eventos | Solo REST síncrono | Resiliencia ante picos, replay para auditoría y proyecciones analíticas |
| Postgres shardeado + TimescaleDB/ClickHouse aparte | Un solo motor para todo | Separar carga transaccional de analítica evita contención |
| Flutter para móvil + React reutilizado en Electron | Nativo puro (Swift/Kotlin) | Menor costo de mantenimiento a cambio de algo de rendimiento nativo, aceptable para este dominio |

---

¿Quieres que profundice en alguno de estos puntos — por ejemplo, el diseño detallado del caso de uso `ClockIn` con Clean Architecture en código, el modelo de datos de PostgreSQL, o el diagrama de despliegue en Kubernetes?
