## Context

`_BranchMapForm` (`app/lib/features/companies/screens/company_settings_screen.dart:93`) hoy usa `Column(Header | Expanded FlutterMap(initialCenter) | Bottom Slider)` sin `MapController`. `setState(_center=…)` mueve marker/circle pero no la cámara — bug clásico `flutter_map 8` (`initialCenter` solo se lee al montar). Fallback CDMX `19.43,-99.13` irrelevante para SCZ `-17.78,-63.18`. `_useMyLocation:132` no verifica `isLocationServiceEnabled` ni `deniedForever`. Desktop no debe mostrar botón si `Geolocator` no soportado. Usuario pide mapa más grande (Opción B fullscreen con controles flotantes) y doble-click para pin.

## Goals / Non-Goals

**Goals:**
- Centrar al abrir en ciudad del usuario (GPS 8s High) o SCZ fallback, zoom 15.
- Botón mi_ubicación condicional por soporte plataforma + manejo `deniedForever → openAppSettings`.
- Pin colocable con single tap y doble click, ambos animan cámara.
- Mapa fullscreen `Stack` con paneles flotantes.

**Non-Goals:**
- No tocar `live_map_screen.dart`, `evaluateGeofence`, `Branch` schema, accuracy/mock, marcación.

## Decisions

- **MapController en State + Stack/Positioned.fill:** `flutter_map 8.3.2` requiere `MapController` para `move()`. Alternativa `Key` para recrear `FlutterMap` descartada por costo y flicker. Reusa `latlong2`, `TileLayer` OSM.
- **Fallback SCZ `-17.78,-63.18`:** coincide con `live_map_screen.dart:9`, no CDMX. Consistente con operación Bolivia.
- **Soporte Geolocator via try/catch `isLocationServiceEnabled`:** `geolocator` lanza `UnsupportedError` en Linux/Windows sin backend. No añadir `permission_handler`. Reusa patrón `home_screen.dart:86`.
- **Deshabilitar `doubleTapZoom` y usar `onTap`/`onDoubleTap` → `_placePin`:** evita conflicto zoom vs colocar pin. Si `onDoubleTap` no existe en 8.3.2, fallback a `onTap` (ya cubre).
- **Stack B con Material elevation + SafeArea:** `Material(elevation:4/6)` reemplaza `BoxDecoration/BoxShadow` (`:210`). `SafeArea` maneja notch de `DesktopShell`/`PageShell`. SearchResults overlay dentro del panel superior.

## Risks / Trade-offs

- `MapController.move` requiere widget montado → llamar solo después de `onMapReady` o post-frame. Mitigación: guardar `LatLng` pendiente.
- `UnsupportedError` en desktop si no se cacha → crash. Mitigación: `try/catch` en `initState`.
- Nominatim throttle 1100ms + debounce 400ms → búsqueda puede sentirse lenta. Mitigación: mantener pero no empeorar.
- Doble-click en trackpad puede no disparar `onDoubleTap`. Mitigación: single tap ya funciona.

