## ADDED Requirements

### Requirement: Last position cache
The mobile app SHALL cache the last successful GPS `Position` (latitude, longitude, accuracy, timestamp) for up to 24h in secure storage and reuse it as fallback.

#### Scenario: GPS timeout fallback
- **WHEN** `Geolocator.getCurrentPosition` times out after 5s and a cached position exists and is less than 24h old
- **THEN** the attendance registration SHALL use the cached position with `isCachedPosition=true`

### Requirement: Offline queue for attendance
When offline or when using cached position, the app SHALL store the attendance record locally in a `pending_timecontrols` queue (Hive/SharedPreferences) with `pendingSync=true`, `isOffline`, `isCachedPosition`, `geofencePassLocal`.

#### Scenario: Mark offline
- **WHEN** employee taps "Entrada" with no internet
- **THEN** the UI SHALL show "Registrado offline, se sincronizará" and the record SHALL be queued locally

### Requirement: Geofence validation deferred
Server SHALL validate geofence on sync; local app MAY perform optimistic haversine validation using cached `company.geofence` (lat/lng/radius) but the authoritative result is server-side on sync.

#### Scenario: Sync validates geofence
- **WHEN** a queued record is synced
- **THEN** the server SHALL compute haversine distance and set `geofenceValidated` and return the final status to the client

### Requirement: Auto-sync on connectivity restore
The app SHALL watch connectivity (`connectivity_plus`) and automatically attempt to sync all queued records when online, with retry and deduplication.

#### Scenario: Connectivity restored
- **WHEN** device regains internet and queue is non-empty
- **THEN** the app SHALL POST each queued record to `POST /api/locations` in order and clear entries on 2xx

### Requirement: Geofence cache refresh
The app SHALL refresh the cached `company.geofence` at login and every 1h when online.

#### Scenario: Geofence updated by admin
- **WHEN** admin updates company geofence and employee is online within 1h
- **THEN** the employee device SHALL have the new radius/center for next offline validation
