# Layouts Specification

## Purpose
TBD - created by syncing change split-mobile-layouts. Update Purpose after archive.

## Requirements

### Requirement: Three-shell navigation
The app SHALL provide three distinct shells: `DesktopShell`, `AdminMobileShell`, `EmployeeMobileShell` each with its own router (`desktopRouter`, `mobileRouter`) and `ShellRoute`.

#### Scenario: Employee on mobile sees employee shell
- **WHEN** an `employee` logs in on Android/iOS
- **THEN** the app SHALL navigate to `EmployeeMobileShell` with bottom tabs `Inicio | Mi Día | Historial | Perfil` and drawer sections `MI JORNADA` and `MIS SOLICITUDES`

#### Scenario: Admin on mobile sees admin shell
- **WHEN** a `business_owner|admin|supervisor|hr_manager` logs in on mobile
- **THEN** the app SHALL navigate to `AdminMobileShell` with bottom tabs `Dashboard | Equipo | Órdenes | Solicitudes` and the unified `Solicitudes` queue

#### Scenario: Platform roles blocked on mobile
- **WHEN** a `platform_admin|support|superuser` authenticates on mobile
- **THEN** the router SHALL redirect to `/login` with message "Usa la versión desktop" and not mount any mobile shell

#### Scenario: Desktop shell
- **WHEN** the app runs on Windows/macOS/Linux/Web
- **THEN** it SHALL mount `DesktopShell` with persistent sidebar (`OPERACIÓN`, `TALENTO`, `SISTEMA`) regardless of tenant role (platform roles see platform sections)

### Requirement: No route leakage between platforms
Mobile routers SHALL NOT expose desktop-only routes (`/employees` table view, `/company-settings` full map editor is exposed only as `/admin/company-settings`) and desktop router SHALL NOT expose mobile-only routes (`/home`, `/history`).

#### Scenario: Manual navigation blocked
- **WHEN** an employee on mobile navigates to `/employees`
- **THEN** the router SHALL redirect to `/home` (or nearest allowed route)

### Requirement: Responsive dashboard
`DashboardScreen` SHALL render as cards via `Wrap` when `width < 600` and as table when wider, without duplicating the widget.

#### Scenario: Narrow viewport
- **WHEN** dashboard is opened on a 360dp wide device
- **THEN** KPIs SHALL stack vertically and attendance SHALL render as cards instead of `DataTable`

### Requirement: Unified logout
All shells SHALL invoke `AuthRepository.logout()` to clear tokens, reset `authState`, and navigate to `/login`.

#### Scenario: Logout from any shell
- **WHEN** user taps "Cerrar sesión" in any shell
- **THEN** tokens are cleared, state is null, and navigation lands on `/login` without residual drawer state
