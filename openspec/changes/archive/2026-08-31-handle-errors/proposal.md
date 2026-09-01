## Why

NexoApp no tiene manejo de errores unificado: la mayoría de controllers (`employees`, `clients`, `permissions`, `vacations`, `dashboard`) no atrapan errores, `server/main.ts:57` responde 500 genérico con `err.message` sin `code` ni `requestId`, y Mongoose (`ValidationError`/`CastError`/`11000`) se expone como 500 técnico. En Flutter `AuthInterceptor` hace `catch(_){}` silencioso y datasources lanzan `Exception` genérica. Se necesita un sistema en lugar de middleware disperso: proxies que intercepten errores, mensajes amigables para el usuario, correlación `requestId` y `Result` en data layer.

## What Changes

- Introduce `AppError extends Error {statusCode, code, isOperational}` + `errorCatalog` con mensajes amigables en español (no técnicos) y `normalizeError()` que también entiende el legacy `throw {statusCode, message}`.
- Agrega middleware liviano de correlación `requestId` (`x-request-id` header, `req.id`, `pino.child`) — no es middleware de error, es trazabilidad.
- Envuelve `ServiceFactory.getService()` y `repositories/*` con `createErrorProxy` (JS Proxy) que mapea Mongoose/Zod/JWT a `AppError` amigable; envuelve controllers con `proxyController` que traduce `AppError` a `res.status().json({message, code, requestId, errors?})`.
- Safety net fallback para errores fuera de proxies (ej. `express.json` syntax error) que usa `normalizeError`.
- En `server/src/routes/employees.ts:32` `setupEmployeeNamespace` usa proxy de socket: `socket.data.requestId` + `socket.emit('error', {message, code, requestId})`.
- En `app/lib/core/network` + `app/lib/data/datasources`: introduce `Result<T>`/`Failure` sealed (Dart 3, sin deps), `AuthInterceptor` sin `catch(_)` silencioso, y datasources retornan `Future<Result<T,Failure>>`.
- Logging: `pino.error({requestId, code, technical})` siempre; respuesta en prod nunca expone `stack`, en dev bajo `debug` key.
- Respuesta error aditiva `{message, code, requestId, errors?}` — **no breaking** para clientes que leen solo `message`; éxito conserva shape actual + header `x-request-id`.

## Capabilities

### New Capabilities
- `error-handling`: contrato unificado `{message, code, requestId}`, catálogo amigable, mapeo Mongoose, proxies service/repo/controller, requestId, Result en Flutter, socket errors, logging y prod no-leak.

### Modified Capabilities
- (ninguna existente — `openspec/specs/` vacío)

## Impact

- Server: `server/src/utils/*`, `server/src/factories/serviceFactory.ts`, `server/src/repositories/*`, `server/src/controllers/*`, `server/src/middlewares/requestId.ts` (nuevo), `server/main.ts`, `server/src/routes/employees.ts`, `server/src/__tests__/*`.
- App: `app/lib/core/network/*`, `app/lib/data/datasources/*`, `app/lib/data/repositories/*`.
- APIs: enriquecimiento aditivo de errores; sin migración de forma de éxito.
- Deps: ninguna nueva (Dart sealed, Node `crypto.randomUUID`, proxies nativos).
