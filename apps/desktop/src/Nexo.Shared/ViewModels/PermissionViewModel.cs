using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Nexo.Desktop.Helpers;
using Nexo.Desktop.Models.Api;
using Nexo.Desktop.Services;

namespace Nexo.Desktop.ViewModels;

public partial class PermissionViewModel : BaseViewModel
{
    [ObservableProperty]
    private string _selectedStatus = string.Empty;

    [ObservableProperty]
    private string _totalText = string.Empty;

    public ObservableCollection<PermissionDto> Permissions { get; } = [];
    public List<string> StatusFilters { get; } = ["", "pendiente", "aprobado", "rechazado"];
    public List<string> TypeFilters { get; } = ["", "permiso", "licencia", "otro"];

    public PermissionViewModel(ApiService api, INavigationService navigation, AuthService authService, IConnectivityService connectivity)
        : base(api, navigation, authService, connectivity) { }

    [RelayCommand]
    private async Task LoadAsync()
    {
        await ExecuteSafe(async () =>
        {
            var filters = new Dictionary<string, string>();
            if (!string.IsNullOrEmpty(SelectedStatus))
                filters["status"] = SelectedStatus;

            var response = await Api.GetAsync<PaginatedResponse<PermissionDto>>(
                Constants.ApiEndpoints.Permissions, filters);

            Permissions.Clear();
            foreach (var p in response.Data)
                Permissions.Add(p);

            TotalText = $"{response.Data.Count} de {response.Total} solicitudes";
        });
    }

    [RelayCommand]
    private async Task ApproveAsync(string id)
    {
        await UpdateStatusAsync(id, "aprobado");
    }

    [RelayCommand]
    private async Task RejectAsync(string id)
    {
        await UpdateStatusAsync(id, "rechazado");
    }

    private async Task UpdateStatusAsync(string id, string status)
    {
        await ExecuteSafe(async () =>
        {
            await Api.PatchAsync<PermissionDto>($"{Constants.ApiEndpoints.Permissions}/{id}",
                new { status });
            await LoadAsync();
        });
    }
}
