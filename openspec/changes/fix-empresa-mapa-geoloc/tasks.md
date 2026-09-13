## 1. Mapa base y controlador

- [x] 1.1 Añadir `MapController _mapController` a `_BranchMapFormState`, inicializar y `dispose`, pasar `mapController:` a `FlutterMap` (`company_settings_screen.dart:101`)
- [x] 1.2 Extraer helper `_placePin(LatLng)` que hace `reverse` + `setState(_center/_address)` + `_mapController.move(ll, 15)` y reusarlo en `onTap`/`onDoubleTap`

## 2. Geolocalización al abrir y botón condicional

- [x] 2.1 Implementar soporte condicional: `try isLocationServiceEnabled` en `initState` postFrame → `_showMyLocation`, ocultar `IconButton(my_location)` si no soportado (`:197`)
- [x] 2.2 Auto-centrado al abrir: si `editing==null` intentar `Geolocator.getCurrentPosition(high, 8s)` con fallback SCZ `-17.78,-63.18` zoom 15; si `editing!=null` usar branch; mostrar spinner `_locatingInitial`
- [x] 2.3 Reescribir `_useMyLocation` (`:132`) con checks `isLocationServiceEnabled`, `checkPermission/request`, `deniedForever → openAppSettings`, spinner `_locating`, y `move` con zoom 15

## 3. Layout fullscreen B + interacción

- [x] 3.1 Convertir `Column(Header | Expanded Map | Bottom)` (`:193-214`) a `Stack(Positioned.fill Map, Positioned top SafeArea/Material, Positioned bottom SafeArea/Material)` — Opción B
- [x] 3.2 Hacer `searchResults` overlay dentro del panel superior y deshabilitar `doubleTapZoom` (`interactionOptions`) para que doble-click coloque pin
- [x] 3.3 Verificar `flutter analyze` y prueba manual: abrir nueva sucursal en móvil (GPS), en desktop sin geolocator, single/double tap coloca pin y anima

