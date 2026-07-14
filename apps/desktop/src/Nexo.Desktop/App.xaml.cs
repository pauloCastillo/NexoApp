using Nexo.Desktop.Services;
using Nexo.Desktop.Views;
using Nexo.Desktop.ViewModels;

namespace Nexo.Desktop;

public partial class App : Application
{
    private readonly NavigationService _navigation;
    private readonly AuthService _authService;

    public App(NavigationService navigation, AuthService authService)
    {
        InitializeComponent();
        _navigation = navigation;
        _authService = authService;
    }

    protected override Window CreateWindow(IActivationState? activationState)
    {
        return new Window(new AppShell());
    }

    protected override async void OnStart()
    {
        base.OnStart();

        var session = await _authService.GetSessionAsync();
        if (session?.IsAuthenticated == true)
        {
            await _navigation.NavigateToDashboardAsync();
        }
    }
}
