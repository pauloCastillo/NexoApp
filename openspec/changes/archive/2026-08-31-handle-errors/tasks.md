## 1. RequestId correlation

- [x] 1.1 Crear `server/src/middlewares/requestId.ts` con `req.id = x-request-id ?? crypto.randomUUID()`, `res.setHeader('x-request-id', req.id)`, `req.log = logger.child({requestId})`; montar en `server/main.ts` antes de `requestLogger`.
- [x] 1.2 Propagar `requestId` a proxies y logs; verificar header `x-request-id` echo y `requestId` en body de error.

## 2. AppError y catálogo

- [x] 2.1 Crear `server/src/utils/appError.ts` (`AppError extends Error {statusCode, code, isOperational, errors?}`) y `server/src/utils/errorCatalog.ts` (mensajes ES amigables por `code`).
- [x] 2.2 Crear `server/src/utils/normalizeError.ts` que mapea `AppError` | legacy `{statusCode,message}` | `ZodError` | `JsonWebTokenError` | Mongoose `ValidationError`/`CastError`/11000 a `AppError` con `code` y `message` del catálogo; log técnico con `requestId`.

## 3. Proxies de repositorio (Mongoose)

- [x] 3.1 Implementar `server/src/utils/createErrorProxy.ts` (generic Proxy factory) y envolver repos (`employee`, `client`, `workOrder`, `permission`, `vacation`, `timeControl`, `location`) para mapear Mongoose errors a `AppError` amigable.
- [x] 3.2 Verificar `ValidationError→400`, `CastError→400`, `11000→409`, `DocumentNotFound→404` responden con `{message, code, requestId}` y log con `requestId`.

## 4. Proxies de servicio vía ServiceFactory

- [x] 4.1 Modificar `server/src/factories/serviceFactory.ts` para retornar `createErrorProxy(service, ctx)` y asegurar `authService` legacy `throw {statusCode}` pasa por `normalizeError`.
- [x] 4.2 Verificar controllers sin try/catch (`employees`, `clients`, etc.) ya responden normalizado.

## 5. Proxies de controller y safety net

- [x] 5.1 Crear `server/src/utils/proxyController.ts` que envuelve cada controller handler: `try {await fn(req,res)} catch(e){ const appErr=normalizeError(e, req.id); req.log.error(...); res.status(appErr.statusCode).json({message: catalog[appErr.code], code: appErr.code, requestId: req.id, errors: appErr.errors})} `; aplicar a `controllers/*.ts` y actualizar `routes/*` imports.
- [x] 5.2 Añadir fallback safety net en `server/main.ts` para errores fuera de proxies (`express.json` syntax, 404) usando `normalizeError`; asegurar `isDev ? {debug:{stack,technical}} : hidden`.

## 6. Socket namespace

- [x] 6.1 Proxear `server/src/routes/employees.ts` `setupEmployeeNamespace` handlers y `io.of('/api/employees').use(socketAuth)`: `socket.data.requestId`, `socket.emit('error',{message,code,requestId})` con catálogo; mapear auth y service errors.
- [x] 6.2 Verificar `registerEmployeesTimeLocation` y `getTimeLocationEmployee` vía socket usan mismo contrato.

## 7. Flutter Result

- [x] 7.1 Crear `app/lib/core/network/result.dart` (`sealed Result<T> {Ok, Err}` + `Failure{message,code,status,requestId}`) y `api_exception.dart`; mapear `DioException` → `Failure` con `requestId` de header/body.
- [x] 7.2 Refactor `AuthInterceptor` (`app/lib/core/network/auth_interceptor.dart`) sin `catch(_){}` silencioso: log `requestId`, retorno `Err` o rethrow `ApiException` que datasource convierte; actualizar `app/lib/data/datasources/*` y `app/lib/data/repositories/*` a `Future<Result<T,Failure>>` (scope `core/network + data/datasources`).

## 8. Tests profesionales

- [x] 8.1 Server unit: `errorCatalog.test.ts` (15), `appError.test.ts` (8), `errorProxy.test.ts` (20), `controllerProxy.test.ts` (12), `requestId.test.ts` (5), `socketError.test.ts` (6).
- [x] 8.2 Server integration (supertest + mongodb-memory-server): duplicado 409 y CastError 400; Flutter `result_test.dart` (10) + `flutter test` verde; `pnpm lint typecheck test` verde.
