---
title: Desktop Architecture
project: Nexo
version: 1.0.0
status: Draft
type: Architecture Specification
last_updated: 2026-07-07
related:
  - ../.opencode/specs/architecture.md
  - ../.opencode/specs/business-rules.md
  - ../.opencode/specs/security.md
  - ../mobile/services/api.ts
  - ../mobile/services/socket.ts
  - ../server/src/types/models.d.ts
---

# Nexo Desktop — Architecture

## 1. System Context

```text
┌──────────────────────────────────────┐
│  Desktop (C# .NET MAUI)              │
│  Multiplatform (Win/Mac/Linux)       │
│  MVVM + Services                     │
│  Admin/Manager interface             │
└────────────┬──────────────┬──────────┘
             │ REST (HTTPS)  │ Socket.io
             ▼               ▼
     ┌──────────────────────────────┐
     │  Express 5 API + Socket.io   │
     │  (existing — server/)        │
     └──────────────┬───────────────┘
                    │
             ┌──────▼──────┐
             │ MongoDB     │
             │ Atlas       │
             └─────────────┘
```

El desktop **no es un reemplazo** de la web admin — es una app nativa rica que consume el mismo backend que el mobile, con capacidades adicionales de dashboard en tiempo real.

## 2. Stack

| Componente | Tecnología |
| ---------- | ---------- |
| Framework | .NET MAUI (Windows, macOS, Linux) |
| Language | C# 12 |
| Pattern | MVVM (ObservableObject, RelayCommand) |
| HTTP Client | `HttpClient` nativo + `System.Text.Json` |
| Real-time | SocketIOClient (NuGet: SocketIOClient) |
| Auth storage | Windows: `CredentialManager`, macOS: `Keychain` |
| DI | Microsoft.Extensions.DependencyInjection |
| Navigation | Shell-based routing |
| Serialization | System.Text.Json (sin Newtonsoft) |
| Charts | Microcharts (liviano, multi-target) / LiveCharts2 |
| Excel export | ClosedXML (NuGet) |

## 3. Solution Structure

```text
src/Nexo.Desktop/
├── Models/                    # DTOs, request/response types
│   ├── Api/
│   │   ├── AuthResponse.cs        # Login/refresh response
│   │   ├── TimeControlDto.cs      # Marcaje DTO
│   │   ├── EmployeeDto.cs         # Employee list item
│   │   ├── WorkOrderDto.cs
│   │   ├── PermissionDto.cs
│   │   ├── VacationDto.cs
│   │   ├── ClientDto.cs
│   │   └── PaginatedResponse.cs   # Genérico con paginación
│   ├── Domain/
│   │   ├── UserSession.cs         # Estado de sesión actual
│   │   ├── RealtimeEvent.cs       # Evento socket tipado
│   │   ├── DashboardCard.cs       # KPI individual
│   │   └── ReportFilter.cs        # Filtro de reportes
│   └── Enums/
│       ├── UserRole.cs            # EmployeeRole, ManagerRole
│       └── ModulePermission.cs    # Lectura/escritura/admin
│
├── ViewModels/                # Lógica de UI + estado
│   ├── BaseViewModel.cs           # IsBusy, error handling, INotifyPropertyChanged
│   ├── LoginViewModel.cs
│   ├── DashboardViewModel.cs
│   ├── EmployeeListViewModel.cs
│   ├── EmployeeDetailViewModel.cs
│   ├── ReportViewModel.cs
│   ├── WorkOrderViewModel.cs
│   ├── VacationViewModel.cs
│   ├── PermissionViewModel.cs
│   ├── SettingsViewModel.cs
│   └── CompanyViewModel.cs        # (superuser only)
│
├── Views/                     # XAML pages
│   ├── LoginPage.xaml
│   ├── DashboardPage.xaml
│   ├── EmployeeListPage.xaml
│   ├── EmployeeDetailPage.xaml
│   ├── ReportsPage.xaml
│   ├── WorkOrdersPage.xaml
│   ├── VacationsPage.xaml
│   ├── PermissionsPage.xaml
│   ├── SettingsPage.xaml
│   └── CompanyPage.xaml           # (superuser only)
│
├── Services/                  # Comunicación con backend
│   ├── ApiService.cs             # HttpClient wrapper (base REST)
│   ├── AuthService.cs            # Login, refresh, logout, SecureStorage
│   ├── SocketService.cs          # Socket.io client singleton
│   ├── NavigationService.cs      # Shell navigation wrapper
│   ├── ExportService.cs          # Excel/CSV/JSON export
│   ├── LocationService.cs        # (opcional) para registrar ubicaciones
│   └── ConnectivityService.cs    # Online/offline detection
│
├── Controls/                  # Custom reusable controls
│   ├── KpiCard.xaml              # KPI individual card
│   ├── EmployeeCard.xaml         # Employee summary card
│   ├── TimelineControl.xaml      # Timeline de marcajes
│   └── LoadingOverlay.xaml       # Full-page loader
│
├── Converters/                # IValueConverter implementations
│   ├── StatusToColorConverter.cs
│   ├── BoolToVisibilityConverter.cs
│   ├── RoleToIconConverter.cs
│   └── DateTimeFormatConverter.cs
│
├── Helpers/
│   ├── Constants.cs              # API URLs, storage keys
│   ├── SecureStorage.cs          # Platform-safe credential storage
│   ├── DateTimeHelper.cs         # UTC/local conversions
│   └── RoleHelper.cs             # Permission checks
│
├── Resources/
│   ├── Styles/
│   │   ├── Colors.xaml
│   │   └── Styles.xaml
│   ├── Fonts/
│   └── Images/
│
├── App.xaml                    # App entry, DI registration
├── AppShell.xaml               # Shell navigation definition
├── MauiProgram.cs              # DI container setup
└── Nexo.Desktop.csproj
```

## 4. MVVM Pattern

```text
View (XAML)
  │  BindingContext = ViewModel (DI injection)
  ▼
ViewModel (ObservableObject)
  │  Properties → { get; set; } → UI bindings
  │  Commands → RelayCommand → user actions
  │  State → ObservableCollection, bool IsBusy
  ▼
Services
  │  ApiService → HttpClient → Express API
  │  SocketService → SocketIOClient → Socket.io
  ▼
Backend (Express 5)
```

### BaseViewModel pattern

```csharp
public abstract class BaseViewModel : ObservableObject
{
    [ObservableProperty] private bool _isBusy;
    [ObservableProperty] private string? _errorMessage;
    [ObservableProperty] private bool _isOffline;

    protected async Task ExecuteSafe(Func<Task> action)
    {
        if (IsBusy) return;
        IsBusy = true;
        ErrorMessage = null;
        try
        {
            await action();
        }
        catch (HttpRequestException)
        {
            IsOffline = true;
            ErrorMessage = "No se puede conectar al servidor";
        }
        catch (UnauthorizedAccessException)
        {
            // navigate to login
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsBusy = false;
        }
    }
}
```

## 5. API Contract

### REST Endpoints

| Método | Ruta | Body | Respuesta | Roles |
| ------ | ---- | ---- | --------- | ----- |
| POST | `/auth/login` | `{email, password}` + header `user-agent: desktop` | `{manager: {id, username, email, role, token, refreshToken}}` | all |
| POST | `/auth/refresh` | `{refreshToken}` | `{token, refreshToken}` | all |
| GET | `/employees` | query: `?page=&limit=&search=&department=` | `{data: [...], total, page, limit}` | editor, manager, superuser |
| GET | `/employees/:id` | — | `{...employee}` | editor, manager, superuser |
| GET | `/time-controls` | query: `?from=&to=&employee=` | `{data: [...], total}` | editor, manager, superuser |
| GET | `/time-controls/today` | — | `{data: [...], today stats}` | editor, manager, superuser |
| GET | `/clients` | query: `?page=&limit=&search=` | `{data: [...], total, page, limit}` | editor, manager, superuser |
| POST | `/clients` | client body | created client | editor, manager |
| GET | `/locations` | query: `?employee=&from=&to=` | `{data: [...], total}` | editor, manager, superuser |
| GET | `/work-orders` | query: `?page=&limit=&status=&employee=` | `{data: [...], total}` | editor, manager, superuser |
| POST | `/work-orders` | work order body | created WO | editor, manager |
| PATCH | `/work-orders/:id` | status change | updated WO | editor, manager, superuser |
| GET | `/permissions` | query filters | `{data: [...]}` | all |
| POST | `/permissions` | permission body | created permission | editor, manager |
| PATCH | `/permissions/:id` | status | updated permission | manager, superuser |
| GET | `/vacations` | query filters | `{data: [...]}` | all |
| POST | `/vacations` | vacation body | created vacation | editor, manager |
| PATCH | `/vacations/:id` | status | updated vacation | manager, superuser |
| GET | `/companies` | — | `{data: [...companies]}` | superuser only |
| PATCH | `/companies/:id` | company updates | updated company | superuser only |
| GET | `/audit-logs` | query filters | `{data: [...]}` | superuser, manager |
| GET | `/notifications` | — | `{data: [...]}` | all |
| GET | `/employees/export` | query filters | Excel/CSV blob | manager, superuser |

### Socket.io Events

**Connection:**

```csharp
socket = new SocketIOClient.SocketIO(BASE_URL, new SocketIOOptions
{
    Auth = new { token = accessToken }
});
```

**Listen (from server to client):**

| Event | Payload | Descripción |
| ----- | ------- | ----------- |
| `time_control:created` | `{employee, company, date, label, time, location}` | Nuevo marcaje en tiempo real |
| `time_control:updated` | `{controlTimeId, changes}` | Marcaje corregido |
| `employee:online` | `{employeeId, timestamp}` | Employee conectado |
| `employee:offline` | `{employeeId, timestamp}` | Employee desconectado |
| `work_order:status` | `{workOrderId, oldStatus, newStatus, timestamp}` | Cambio de estado de WO |
| `notification:new` | `{type, message, entityId}` | Notificación push |
| `dashboard:stats` | `{checkedIn, onBreak, activeEmployees, lateEmployees}` | Stats consolidados broadcast |

**Emit (from client to server, for admin actions):**

| Event | Payload | Descripción |
| ----- | ------- | ----------- |
| `dashboard:subscribe` | `{companyId}` | Suscribirse a updates del dashboard |
| `dashboard:unsubscribe` | `{companyId}` | Cancelar suscripción |

### Authentication Flow

```text
Desktop                    Express API
  │                          │
  ├─ POST /auth/login ──────►│  (user-agent: desktop)
  │◄─── { manager, token,   │
  │       refreshToken }     │
  │                          │
  ├─ store tokens ──────────►│  SecureStorage
  │                          │
  ├─ GET /employees ────────►│  Authorization: Bearer {token}
  │◄─── { data: [...] }     │
  │                          │
  │  (token expires)         │
  │                          │
  ├─ POST /auth/refresh ────►│
  │◄─── { token, refresh }  │
  │                          │
  │  (refresh fails = 401)   │
  ├─ clear tokens ──────────►│
  ├─ navigate to Login ─────►│
```

## 6. State Management

No Redux — el desktop usa el ViewModel como su propia fuente de verdad, recargando desde API según necesidad:

| Tipo | Dónde | Estrategia |
| ---- | ----- | ---------- |
| Sesión | `AuthService.CurrentSession` | Singleton, persistido en SecureStorage |
| Dashboard en vivo | `DashboardViewModel` | Socket.io events actualizan propiedades observable |
| Listas (empleados, etc.) | VM específico | Carga inicial + pull-to-refresh |
| Notificaciones | `SocketService` | Event bus → cualquier VM que necesite reaccionar |

### Realtime Dashboard Data Flow

```text
Socket.io ──► SocketService ──► EventBus (WeakReference)
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            DashboardVM       NotificationVM   EmployeeDetailVM
            (KPI cards)       (badge count)    (online status)
```

## 7. Navigation

Shell-based with flyout menu:

```text
AppShell
├── Login (no flyout)
├── Dashboard (flyout: true, icon: chart)
├── Employees
│   ├── List
│   └── Detail (modal/push)
├── Work Orders
├── Vacations
├── Permissions
├── Reports
├── Settings
└── Company Management (superuser only, flyout conditional)
```

Routes definidas en `AppShell.xaml.cs`:

```csharp
Routing.RegisterRoute("login", typeof(LoginPage));
Routing.RegisterRoute("dashboard", typeof(DashboardPage));
Routing.RegisterRoute("employees", typeof(EmployeeListPage));
Routing.RegisterRoute("employees/detail", typeof(EmployeeDetailPage));
// ...
```

Role-based flyout visibility:

```csharp
// AppShell.xaml.cs
private void ConfigureFlyoutByRole(UserRole role)
{
    CompanyItem.Visible = role == UserRole.Superuser;
    ReportsItem.Visible = role >= UserRole.Manager;
}
```

## 8. Navigation Diagram

```text
Login Page ──(auth ok)──► Main Shell
                              │
                    ┌─────────┴─────────────┐
                    ▼                       ▼
              Dashboard              Flyout Menu
           (Socket.io live)              │
                    │              ┌──────┴──────┐
                    │              ▼             ▼
                    │         Employees      Work Orders
                    │         (CRUD + map)    (Kanban/List)
                    │              │             │
                    │              ▼             ▼
                    │         Vacancies      Clients
                    │         (approve)      (CRUD)
                    │              │
                    │              ▼
                    │         Reports
                    │         (export)
                    │
              ┌─────┴──────┐
              ▼            ▼
       Notifications   Settings
       (badge count)   (profile)
```

## 9. Security Implementation (Desktop-specific)

| Requisito | Implementación |
| --------- | -------------- |
| TLS | `HttpClient` con `BaseAddress = "https://..."`. Validación de certificado en producción |
| Token storage | `SecureStorage` helper (libsecret en Linux, Keychain en macOS, DPAPI en Windows) |
| Refresh rotation | Interceptor `DelegatingHandler` en HttpClient que captura 401 y refresca |
| Logout | Clear tokens + disconnect socket + navigate to Login |
| Geolocation | Windows: `Windows.Devices.Geolocation`; macOS: `CoreLocation` (only for manager functions) |
| Audit | El desktop genera eventos auditables via API; también muestra audit-logs para superuser |

### Token interceptor (DelegatingHandler)

```csharp
public class AuthDelegatingHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken ct)
    {
        var token = await SecureStorage.GetAccessToken();
        request.Headers.Authorization = new("Bearer", token);

        var response = await base.SendAsync(request, ct);

        if (response.StatusCode == HttpStatusCode.Unauthorized)
        {
            var refreshed = await AuthService.TryRefreshToken();
            if (refreshed)
            {
                token = await SecureStorage.GetAccessToken();
                var retry = await CloneRequest(request);
                retry.Headers.Authorization = new("Bearer", token);
                return await base.SendAsync(retry, ct);
            }
            // redirect to login via event
        }
        return response;
    }
}
```

## 10. Multi-tenant

Cada Manager pertenece a un `company`. Toda petición REST filtra por `companyId` del JWT (el middleware del backend lo maneja). El desktop no necesita enviar explícitamente el `companyId` — el token ya lo contiene.

Para superusers: dropdown selector de tenant en la toolbar, y las requests usan un header extra `X-Company-Override`.

## 11. Error Handling

```csharp
// ApiService.cs — todos los errores HTTP se convierten a excepciones tipadas
public class ApiException : Exception
{
    public int StatusCode { get; }
    public string? ServerMessage { get; }
}

public class UnauthorizedException : ApiException { }
public class ForbiddenException : ApiException { }
public class NotFoundException : ApiException { }
public class ValidationException : ApiException
{
    public Dictionary<string, string[]>? Errors { get; }
}
```

Cada ViewModel captura y muestra en UI (snackbar/toast):

| Error | UX |
| ----- | -- |
| 401 | Clear session → redirect login |
| 403 | Toast "No tienes permiso" |
| 404 | Toast "Recurso no encontrado" |
| 422 | Highlight campos con error |
| Network | Banner "Sin conexión" + retry |
| 500 | Toast "Error del servidor" + log |

## 12. Key Screens

### Login

- Email + password + "Remember me"
- Loading spinner
- Error messages inline

### Dashboard (real-time)

- KPI cards: checked-in count, on break, active, late
- Timeline of today's punches (auto-updating via socket)
- Mini-calendar with attendance summary
- Socket connection indicator (green/red dot)
- Filter: by department, by employee
- Historical toggle: día / semana / mes

### Employee List

- DataGrid with search, pagination
- Filters: department, status (active/inactive)
- Row actions: view detail, edit, download QR
- Pull-to-refresh

### Employee Detail

- Profile card (photo, name, role, department)
- Timeline of today's time controls
- Location history (map)
- Work orders, vacations, permissions tabs
- Edit form

### Reports

- Date range picker + employee selector
- Export: Excel, CSV, JSON
- Predefined templates: daily attendance, monthly hours, location history

## 13. Performance Considerations

- **Socket reconnection**: Exponential backoff (1s → 2s → 4s → max 30s)
- **List virtualization**: MAUI `CollectionView` with `RemainingItemsThreshold` for infinite scroll
- **Image caching**: `FFImageLoading` or cached images for employee photos
- **Debounced search**: 300ms debounce on search inputs before API call
- **Batch socket updates**: If server sends burst, throttle UI updates to 1 frame (16ms)

## 14. Project Setup Plan

1. `dotnet new maui -n Nexo.Desktop`
2. Install NuGet packages: `SocketIOClient`, `CommunityToolkit.Mvvm`, `ClosedXML`, `Microcharts.Maui`
3. Create folder structure as defined above
4. Implement `MauiProgram.cs` with DI registration
5. Implement base services: `ApiService`, `AuthService`, `SecureStorage`
6. Implement `LoginViewModel` + `LoginPage`
7. Implement `AppShell` with role-based navigation
8. Release 1.0: Login + Dashboard + Employee CRUD
9. Release 1.1: Reports + Export
10. Release 1.2: Work Orders + Vacations + Permissions full management
