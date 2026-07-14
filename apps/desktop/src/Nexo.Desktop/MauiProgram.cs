using Microcharts.Maui;
using Microsoft.Extensions.Logging;
using Nexo.Desktop.Services;
using Nexo.Desktop.ViewModels;
using Nexo.Desktop.Views;

namespace Nexo.Desktop;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseMicrocharts()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        // Platform Services (interfaces)
        builder.Services.AddSingleton<IConnectivityService, MauiConnectivityService>();
        builder.Services.AddSingleton<INavigationService, MauiNavigationService>();
        builder.Services.AddSingleton<ITokenStorage, MauiTokenStorage>();
        builder.Services.AddSingleton<IFileService, MauiFileService>();

        // Services
        builder.Services.AddSingleton<AuthService>();
        builder.Services.AddSingleton<SocketService>();
        builder.Services.AddSingleton<ExportService>();
        builder.Services.AddTransient<ApiService>(sp =>
        {
            var auth = sp.GetRequiredService<AuthService>();
            return new ApiService(new HttpClient(), auth);
        });

        // ViewModels
        builder.Services.AddTransient<LoginViewModel>();
        builder.Services.AddTransient<DashboardViewModel>();
        builder.Services.AddTransient<EmployeeListViewModel>();
        builder.Services.AddTransient<EmployeeDetailViewModel>();
        builder.Services.AddTransient<ReportViewModel>();
        builder.Services.AddTransient<WorkOrderViewModel>();
        builder.Services.AddTransient<VacationViewModel>();
        builder.Services.AddTransient<PermissionViewModel>();
        builder.Services.AddTransient<SettingsViewModel>();
        builder.Services.AddTransient<CompanyViewModel>();

        // Views
        builder.Services.AddTransient<LoginPage>();
        builder.Services.AddTransient<DashboardPage>();
        builder.Services.AddTransient<EmployeeListPage>();
        builder.Services.AddTransient<EmployeeDetailPage>();
        builder.Services.AddTransient<ReportsPage>();
        builder.Services.AddTransient<WorkOrdersPage>();
        builder.Services.AddTransient<VacationsPage>();
        builder.Services.AddTransient<PermissionsPage>();
        builder.Services.AddTransient<SettingsPage>();
        builder.Services.AddTransient<CompanyPage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
