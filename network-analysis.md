# Network Failed — Análisis de Causas

## 🔴 CRÍTICA — HTTPS + Certificado Auto-Firmado

**Archivo:** `.env`
```
EXPO_PUBLIC_BASEURL=https://192.168.1.10:9000/api/
```

La URL usa **HTTPS con IP local**, lo que implica certificado SSL no válido. React Native (OkHttp/NSURLSession) rechaza certificados auto-firmados por defecto → "Network Failed".

Afecta a toda la app:
- `services/api.ts:34` — sin configuración SSL
- `services/api.ts:80` — refresh token
- `services/socket.ts:18` — socket.io-client

**Solución:** Usar `http://localhost:9000/api/` en dev, o configurar axios/socket.io para aceptar el certificado.

---

## 🔴 CRÍTICA — Socket.io sin manejo de errores

**Archivos:** `services/socket.ts`, `app/(main)/home.tsx:67`

```ts
// socket.ts:18 — sin handlers de error/connect_error
socket = io(baseUrl, { agent: "mobile", auth: { token } });

// home.tsx:67 — patrón incorrecto, el ack callback nunca se ejecuta si falla la conexión
socket.emit("getLocation", () => {
  dispatch(registerTimeAndLocations(locationTimeData));
});
```

No hay handlers para `connect_error`, `disconnect`, ni retry. Si el WebSocket falla, el `emit` falla silenciosamente.

**Solución:** Agregar handlers de error/reconnect, y validar `socket.connected` antes de emitir.

---

## 🟡 MEDIA — Axios sin timeout

**Archivo:** `services/api.ts:34`

```ts
const api = axios.create({ baseURL: BASE_URL });
```

Sin `timeout` las requests pueden colgarse minutos en redes lentas o si el servidor no responde.

**Solución:** Agregar `timeout: 10000` (10s) en la creación de axios.

---

## 🟡 MEDIA — Token refresh vulnerable al mismo error SSL

**Archivo:** `services/api.ts:80`

```ts
const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
```

Si todas las requests fallan por SSL, el refresh también falla → `clearTokens()` → sesión perdida sin explicación.

**Solución:** Misma que punto 1 (cambiar a HTTP en dev o configurar SSL).

---

## 🟡 MEDIA — Manejo genérico de errores de red

**Archivos:** Todos los stores (`store/`)

```ts
catch (error) {
  return rejectWithValue(
    error instanceof Error ? error.message : "Error genérico"
  );
}
```

Un error de red en axios produce `error.message = "Network Error"`. No se distingue entre error de red, 4xx, 5xx, etc.

**Solución:** Interceptar errores de red en el interceptor de axios y mostrar mensajes legibles al usuario.
