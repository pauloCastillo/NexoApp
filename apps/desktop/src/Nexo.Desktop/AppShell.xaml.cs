using Nexo.Desktop.Models.Domain;
using Nexo.Desktop.Services;

namespace Nexo.Desktop;

public partial class AppShell : Shell
{
    private readonly AuthService _authService;

    public AppShell(AuthService authService)
    {
        InitializeComponent();
        _authService = authService;

        Routing.RegisterRoute("login", typeof(Views.LoginPage));
        Routing.RegisterRoute("dashboard", typeof(Views.DashboardPage));
        Routing.RegisterRoute("employees", typeof(Views.EmployeeListPage));
        Routing.RegisterRoute("employees/detail", typeof(Views.EmployeeDetailPage));
        Routing.RegisterRoute("workorders", typeof(Views.WorkOrdersPage));
        Routing.RegisterRoute("vacations", typeof(Views.VacationsPage));
        Routing.RegisterRoute("permissions", typeof(Views.PermissionsPage));
        Routing.RegisterRoute("reports", typeof(Views.ReportsPage));
        Routing.RegisterRoute("settings", typeof(Views.SettingsPage));
        Routing.RegisterRoute("company", typeof(Views.CompanyPage));

        UpdateFlyoutByRole();

        _authService.SessionChanged += async () =>
        {
            var session = await _authService.GetSessionAsync();
            UpdateFlyout(session);
        };
    }

    private void UpdateFlyoutByRole()
    {
        _ = UpdateFlyoutAsync();
    }

    private async Task UpdateFlyoutAsync()
    {
        var session = await _authService.GetSessionAsync();
        UpdateFlyout(session);
    }

    private void UpdateFlyout(UserSession? session)
    {
        bool isAuthenticated = session?.IsAuthenticated == true;
        bool isSuperuser = session?.IsSuperuser == true;
        bool canViewAdmin = session?.Role is "manager" or "superuser" or "editor";

        LoginShell.IsVisible = !isAuthenticated;
        DashboardItem.IsVisible = isAuthenticated;
        EmployeesItem.IsVisible = isAuthenticated;
        WorkOrdersItem.IsVisible = canViewAdmin;
        VacationsItem.IsVisible = canViewAdmin;
        PermissionsItem.IsVisible = canViewAdmin;
        ReportsItem.IsVisible = session?.IsManager == true;
        SettingsItem.IsVisible = isAuthenticated;
        CompanyItem.IsVisible = isSuperuser;

        Shell.FlyoutBehavior = isAuthenticated ? FlyoutBehavior.Flyout : FlyoutBehavior.Disabled;
    }
}
