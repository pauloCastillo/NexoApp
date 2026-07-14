using CommunityToolkit.Mvvm.ComponentModel;
using Nexo.Desktop.Models.Domain;
using Nexo.Desktop.Services;

namespace Nexo.Desktop.ViewModels;

public partial class BaseViewModel : ObservableObject
{
    [ObservableProperty]
    private bool _isBusy;

    [ObservableProperty]
    private string? _errorMessage;

    [ObservableProperty]
    private bool _isOffline;

    [ObservableProperty]
    private bool _isRefreshing;

    protected readonly ApiService Api;
    protected readonly INavigationService Navigation;
    protected readonly AuthService AuthService;
    protected readonly IConnectivityService Connectivity;

    public BaseViewModel(ApiService api, INavigationService navigation, AuthService authService, IConnectivityService connectivity)
    {
        Api = api;
        Navigation = navigation;
        AuthService = authService;
        Connectivity = connectivity;
    }

    protected async Task ExecuteSafe(Func<Task> action)
    {
        if (IsBusy) return;
        IsBusy = true;
        ErrorMessage = null;
        try
        {
            await action();
        }
        catch (UnauthorizedException)
        {
            ErrorMessage = "Sesión expirada. Redirigiendo al login...";
            await AuthService.LogoutAsync();
            await Navigation.NavigateToLoginAsync();
        }
        catch (ForbiddenException ex)
        {
            ErrorMessage = ex.Message;
        }
        catch (NotFoundException ex)
        {
            ErrorMessage = ex.Message;
        }
        catch (HttpRequestException)
        {
            IsOffline = true;
            ErrorMessage = "Sin conexión al servidor";
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsBusy = false;
            IsRefreshing = false;
        }
    }

    protected async Task<UserSession?> GetSessionAsync()
    {
        return await AuthService.GetSessionAsync();
    }
}
