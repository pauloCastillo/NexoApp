## Why

El mapa de Empresa & Sucursales (`CompanySettingsScreen._BranchMapForm`) no centra en la ciudad del usuario, usa un fallback hardcodeado en CDMX, no anima la cámara al mover el pin y muestra el botón "mi ubicación" aunque la plataforma no soporte Geolocator. Zoom fijo 15 y sin soporte doble-click para colocar pin. Además ocupa solo ~60% de la pantalla.

## What Changes

- Centrar el mapa al abrir cerca del usuario: si edita sucursal usa su `lat/lng`; si crea, intenta `Geolocator.getCurrentPosition` (8s, High accuracy) y fallback a SCZ `-17.78,-63.18` zoom 15.
- Botón "mi ubicación" condicional: ocultar si `Geolocator.isLocationServiceEnabled()` lanza `UnsupportedError`; si soportado, geolocalizar inmediato con manejo de `deniedForever` → `openAppSettings`.
- Añadir `MapController` y helper `_placePin` para que `_useMyLocation`, búsqueda y `onTap`/`onDoubleTap` animen la cámara (`move` zoom 15).
- Convertir layout `Column+Expanded` a `Stack` fullscreen (Opción B): `Positioned.fill` mapa + `Positioned` top/bottom flotantes con `Material` + `SafeArea`. `searchResults` overlay dentro del panel superior.
- Doble click coloca pin (además de single tap), deshabilitando `doubleTapZoom` por defecto.

## Capabilities

### New Capabilities
- (ninguna nueva capacidad de dominio — es fix de UX del mapa existente)

### Modified Capabilities
- (no hay specs en `openspec/specs/`; se omite spec delta — comportamiento ya cubierto por Branch/Geofence existente)

## Impact

- Afectado: `app/lib/features/companies/screens/company_settings_screen.dart` (1 archivo), `app/lib/core/services/geocoding_service.dart` sin cambios.
- Dependencias: `flutter_map ^8.3.2`, `latlong2`, `geolocator ^14.0.3` ya instaladas.
- Riesgo: `MapController.dispose` requerido; `onDoubleTap` si no existe en 8.3.2 fallback a `onTap`.
