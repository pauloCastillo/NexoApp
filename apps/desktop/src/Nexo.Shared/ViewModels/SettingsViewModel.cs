using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Nexo.Desktop.Models.Domain;
using Nexo.Desktop.Services;

namespace Nexo.Desktop.ViewModels;

public partial class SettingsViewModel : BaseViewModel
{
    [ObservableProperty]
    private UserSession? _session;

    [ObservableProperty]
    private string _appVersion = "1.0.0";

    public SettingsViewModel(ApiService api, INavigationService navigation, AuthService authService, IConnectivityService connectivity)
        : base(api, navigation, authService, connectivity) { }

    [RelayCommand]
    private async Task LoadAsync()
    {
        Session = await GetSessionAsync();
    }

    [RelayCommand]
    private async Task LogoutAsync()
    {
        await AuthService.LogoutAsync();
        await Navigation.NavigateToLoginAsync();
    }
}
