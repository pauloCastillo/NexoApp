## ADDED Requirements

### Requirement: Report export parity on mobile-admin
Mobile-admin SHALL be able to export reports to Excel (`.xlsx`) with the same date-range and filters as desktop, via `ReportRepository.exportExcel()`.

#### Scenario: Export on mobile
- **WHEN** an admin on mobile selects a date range and taps "Exportar a Excel"
- **THEN** the app SHALL download/generate the `.xlsx` via `GET /api/reports` or local generation and show success

### Requirement: Share via system sheet
Mobile-admin SHALL be able to share the exported `.xlsx` via the system share sheet (Google Drive, WhatsApp, etc.) using `share_plus`.

#### Scenario: Share to WhatsApp
- **WHEN** admin taps "Compartir" on the exported file
- **THEN** the system share sheet SHALL open with the `.xlsx` attached as `ShareXFile`

### Requirement: Company geofence update permissions
Only `business_owner`, `admin`, `platform_admin` SHALL be able to update `company.location` and `geofenceRadius` via `PUT /api/companies`.

#### Scenario: Allowed geofence update
- **WHEN** an `admin` updates geofence to 500m
- **THEN** the update succeeds and subsequent attendance validations use the new radius

#### Scenario: Forbidden geofence update
- **WHEN** a `supervisor` tries to update geofence
- **THEN** the server SHALL return 403
