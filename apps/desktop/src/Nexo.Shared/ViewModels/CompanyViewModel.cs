using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Nexo.Desktop.Helpers;
using Nexo.Desktop.Models.Api;
using Nexo.Desktop.Services;

namespace Nexo.Desktop.ViewModels;

public partial class CompanyViewModel : BaseViewModel
{
    [ObservableProperty]
    private string _selectedCompanyId = string.Empty;

    public ObservableCollection<CompanyDto> Companies { get; } = [];

    public CompanyViewModel(ApiService api, INavigationService navigation, AuthService authService, IConnectivityService connectivity)
        : base(api, navigation, authService, connectivity) { }

    [RelayCommand]
    private async Task LoadAsync()
    {
        await ExecuteSafe(async () =>
        {
            var response = await Api.GetAsync<CompanyListResponse>(Constants.ApiEndpoints.Companies);
            Companies.Clear();
            foreach (var c in response.Data)
                Companies.Add(c);
        });
    }
}

public class CompanyDto
{
    [System.Text.Json.Serialization.JsonPropertyName("_id")]
    public string Id { get; set; } = string.Empty;
    [System.Text.Json.Serialization.JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    [System.Text.Json.Serialization.JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
    [System.Text.Json.Serialization.JsonPropertyName("inviteCode")]
    public string? InviteCode { get; set; }
}

public class CompanyListResponse
{
    [System.Text.Json.Serialization.JsonPropertyName("data")]
    public List<CompanyDto> Data { get; set; } = [];
}
