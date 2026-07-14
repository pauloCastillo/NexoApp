# Nexo Desktop

Aplicación de escritorio C# .NET MAUI para administración de Nexo (dashboard en tiempo real, CRUD de empleados, reportes).

## Requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- Workload MAUI: `dotnet workload install maui` (Windows/macOS)
- Windows 10 19041+ o macOS 14+ para compilar targets desktop

## Build

Compilar desde **Windows** (target Windows) o **macOS** (target macOS):

```bash
cd src/Nexo.Desktop
dotnet restore
dotnet build
dotnet run
```

## WSL / Linux Workflow

El proyecto MAUI solo compila en Windows/macOS. Para trabajar desde WSL/Linux:

1. **Edita código** desde WSL (todos los .cs son texto plano)
2. **Compila el MAUI** en Windows: `dotnet build src/Nexo.Desktop`
3. Opcional: crea un proyecto de tests que sí corre en Linux

### Publicar instalador Windows

```bash
dotnet publish src/Nexo.Desktop -f net10.0-windows10.0.19041.0 -c Release
```

## Stack

| Capa | Tecnología |
| ---- | -------- |
| UI | .NET MAUI (XAML) |
| Pattern | MVVM (CommunityToolkit.Mvvm) |
| HTTP | HttpClient + DelegatingHandler (auth) |
| Tiempo real | SocketIOClient |
| Persistencia local | SecureStorage / Preferences |
| Export | ClosedXML (Excel) |

## Estructura

```text
src/Nexo.Desktop/
├── Models/       # DTOs del API + modelos de dominio
├── ViewModels/   # MVVM ViewModels + BaseViewModel
├── Views/        # Páginas XAML
├── Services/     # ApiService, AuthService, SocketService, etc.
├── Controls/     # KpiCard, LoadingOverlay
├── Converters/   # IValueConverter personalizados
└── Helpers/      # Constants, SecureStorage, DateTimeHelper
```
