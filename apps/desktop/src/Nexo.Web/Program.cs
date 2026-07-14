using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Nexo.Desktop.Services;
using Nexo.Desktop.ViewModels;
using Nexo.Web;
using Nexo.Web.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Platform Services
builder.Services.AddSingleton<WebConnectivityService>();
builder.Services.AddSingleton<IConnectivityService>(sp => sp.GetRequiredService<WebConnectivityService>());
builder.Services.AddSingleton<INavigationService, WebNavigationService>();
builder.Services.AddSingleton<ITokenStorage, WebTokenStorage>();
builder.Services.AddSingleton<IFileService, WebFileService>();

// Services
builder.Services.AddSingleton<AuthService>();
builder.Services.AddSingleton<SocketService>();
builder.Services.AddSingleton<ExportService>();
builder.Services.AddTransient<ApiService>(sp =>
{
    var auth = sp.GetRequiredService<AuthService>();
    var http = new HttpClient { BaseAddress = new Uri(sp.GetRequiredService<IConfiguration>()["Api:BaseUrl"] ?? "http://localhost:3000") };
    return new ApiService(http, auth);
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

await builder.Build().RunAsync();
