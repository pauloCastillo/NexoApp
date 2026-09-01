## Context

Estado actual: `server/main.ts:57` tiene un único `app.use((err,req,res)=>res.status(500).json({message: err.message}))` que ignora `err.statusCode` y expone mensajes técnicos. `authController.ts` hace try/catch con `throw {statusCode, message}`, `workOrdersController` solo en `start/complete/cancel`, el resto (`employeeController`, `clientsController`, `permissionsController`, `vacationsController`, `dashboardController`) sin try/catch — cualquier `ValidationError`/`CastError`/`11000` de Mongoose cae a 500. Flutter `AuthInterceptor.onError` hace `catch(_){}` silencioso y datasources lanzan `Exception` genérica. Multi-tenant por `companyId` en JWT, `pino` en `server/src/utils/logger.ts`.

Stakeholders: backend Express+Mongoose, Flutter mobile/desktop, soporte que necesita `requestId` para correlación.

## Goals / Non-Goals

**Goals:**
- Contrato de error unificado `{message, code, requestId, errors?}` con `message` amigable ES no técnico y `code` estable para Flutter/i18n.
- Proxies JS en `ServiceFactory.getService()` + repos + controllers que interceptan y normalizan errores (en lugar de middleware disperso), con `requestId` propagado a logs y respuesta.
- Flutter `Result<T>/Failure` sealed sin deps en `core/network` + `data/datasources`.
- Socket `setupEmployeeNamespace` emite errores con mismo contrato.
- Logging estructurado siempre con `requestId`/`code`/`technical`; prod nunca expone `stack`.

**Non-Goals:**
- RFC7807 `type/title/detail` completo.
- Versionado breaking de éxito (`{users}` → `{data}`).
- Agregar `dartz`/`fpdart` o deps nuevas.
- Reescribir UI `presentation/` para consumir `Result` (solo hasta `repository`).

## Decisions

**1) Proxies en lugar de middleware central — por qué:**
- Middleware solo ve errores que llegan a `next(err)` en ciclo Express. Jobs, `auditLogService.log` fire-and-forget y handlers de socket escapan.
- Proxy en `ServiceFactory.getService()` (`server/src/factories/serviceFactory.ts:12`) envuelve una vez y cubre todos los callers; un guard en el proxy es diff mínimo vs guard en cada controller (ponytail: root-cause fix). Fallback safety net para `express.json` syntax errors que no pasan por factory.
- Alternativa considerada: middleware `asyncHandler` + `errorMiddleware` — descartada porque deja 7 controllers con try/catch duplicado y no cubre sockets.

**2) `AppError` + `errorCatalog` + `normalizeError`:**
- `AppError extends Error {statusCode, code, isOperational, errors?}`. `errorCatalog` mapea `code→{statusCode, message}` ES amigable. `normalizeError(e)` entiende `AppError`, legacy `throw {statusCode, message}`, `ZodError`, `JsonWebTokenError`, Mongoose `ValidationError`/`CastError`/11000. Log guarda `technical: e.message+stack`, respuesta usa `catalog[code].message`.

**3) `requestId` correlación:**
- Middleware liviano antes de todo (no error): `req.id = req.headers['x-request-id'] ?? crypto.randomUUID()` (`node:crypto`), `res.setHeader('x-request-id', req.id)`, `req.log = logger.child({requestId: req.id})`. Proxy lee `req.id` de closure/context. Flutter lee header `x-request-id` y `body.requestId` para reporte.

**4) Mongoose mapping en repo proxy:**
- `ValidationError` → 400 `VALIDATION_ERROR` + `errors: [{field, message}]` mapeado de `err.errors`.
- `CastError` → 400 `INVALID_ID`.
- `11000` → 409 `DUPLICATE` / `CONFLICT` con campo de `err.keyValue`.
- `DocumentNotFound` (null) → 404 `NOT_FOUND`.
- Timeout/conexión → 503 `DB_UNAVAILABLE` con "Servicio temporalmente no disponible."

**5) Flutter `Result` sealed nativo Dart 3:**
- `sealed class Result<T> { } class Ok<T> implements Result<T> { final T value } class Err<T> implements Result<T> { final Failure failure }` + `Failure{message, code, status, requestId}`. Sin deps (Dart 3.12 ya soporta sealed). Interceptor mapea `DioException→Failure` y datasources retornan `Future<Result<...>>`.

**6) Compat aditiva:** éxito conserva `{users, clients, workOrders}` + añade header `x-request-id`; error añade `code, requestId` opcionales — cliente viejo que lee solo `message` no se rompe. Sin `Accept: v=2` por ahora; si se necesita breaking futuro, se versiona.

**7) `isDev ? debug : hidden`:** `logger.error({err, requestId, code})` siempre. Respuesta prod: `{message: friendly, code, requestId}`. Dev: `+ {debug: {stack, technical}}` bajo key `debug` para no contaminar `message`.

## Risks / Trade-offs

- [Proxy overhead] Trap por cada método → mitigation: proxy solo en factory (1 instancia por request) y cache de wrappers, overhead despreciable.
- [Compat legacy throw] `throw {statusCode, message}` sin `instanceof Error` → mitigation: `normalizeError` detecta `e.statusCode` y lo convierte, deprecated con `// ponytail: legacy compat`.
- [Socket auth fuera de Express] → mitigation: `io.of('/api/employees').use(socketAuthProxy)` con mismo `AppError`/`requestId` en `socket.data`.
- [Mensajes ES amigables pierden detalle técnico] → mitigation: log técnico completo + `requestId` para soporte, `errors` por campo en 400.
- [Flutter Result migración parcial] → mitigation: solo `core/network` + `data/datasources` retornan `Result`; `data/repositories` adaptan, UI migra gradual.

## Migration Plan

1. Deploy con `normalizeError` compat + `requestId` middleware (sin romper).
2. Envolver `ServiceFactory` y repos (proxy) → validar con tests + staging.
3. Envolver controllers + socket → validar.
4. Flutter `Result` en `core/network` + datasources → validar con `flutter test`.
5. Remover legacy `throw {statusCode}` tras métrica `code` adoption (1 sprint). Rollback: revertir proxy wrappers, fallback `errorMiddleware` sigue respondiendo.

## Open Questions

- Tono mensajes ES: formal vs cercano — default cercano ("No encontramos…").
- ¿Header `x-request-id` suficiente o también `body.requestId` siempre? → default ambos.
