using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Nexo.Desktop.Services;

namespace Nexo.Desktop.ViewModels;

public partial class LoginViewModel : BaseViewModel
{
    [ObservableProperty]
    private string _email = string.Empty;

    [ObservableProperty]
    private string _password = string.Empty;

    [ObservableProperty]
    private bool _rememberMe = true;

    public LoginViewModel(ApiService api, INavigationService navigation, AuthService authService, IConnectivityService connectivity)
        : base(api, navigation, authService, connectivity) { }

    [RelayCommand]
    private async Task LoginAsync()
    {
        if (string.IsNullOrWhiteSpace(Email) || string.IsNullOrWhiteSpace(Password))
        {
            ErrorMessage = "Correo y contraseña son requeridos";
            return;
        }

        await ExecuteSafe(async () =>
        {
            await AuthService.LoginAsync(Email.Trim(), Password);
            await Navigation.NavigateToDashboardAsync();
        });
    }
}
