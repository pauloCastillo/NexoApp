using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Nexo.Desktop.Helpers;
using Nexo.Desktop.Models.Api;
using Nexo.Desktop.Services;

namespace Nexo.Desktop.ViewModels;

public partial class WorkOrderViewModel : BaseViewModel
{
    [ObservableProperty]
    private string _selectedStatus = string.Empty;

    [ObservableProperty]
    private string _totalText = string.Empty;

    public ObservableCollection<WorkOrderDto> WorkOrders { get; } = [];
    public List<string> StatusFilters { get; } = ["", "pendiente", "en_progreso", "completado", "cancelado"];

    private int _currentPage = 1;
    private bool _hasMore = true;

    public WorkOrderViewModel(ApiService api, INavigationService navigation, AuthService authService, IConnectivityService connectivity)
        : base(api, navigation, authService, connectivity) { }

    [RelayCommand]
    private async Task LoadAsync()
    {
        _currentPage = 1;
        WorkOrders.Clear();
        _hasMore = true;
        await LoadPageAsync();
    }

    [RelayCommand]
    private async Task LoadMoreAsync()
    {
        if (!_hasMore || IsBusy) return;
        await LoadPageAsync();
    }

    [RelayCommand]
    private async Task ChangeStatusAsync(string status)
    {
        SelectedStatus = status;
        await LoadAsync();
    }

    private async Task LoadPageAsync()
    {
        await ExecuteSafe(async () =>
        {
            var filters = new Dictionary<string, string>
            {
                ["page"] = _currentPage.ToString(),
                ["limit"] = Constants.DefaultPageSize.ToString()
            };

            if (!string.IsNullOrEmpty(SelectedStatus))
                filters["status"] = SelectedStatus;

            var response = await Api.GetAsync<PaginatedResponse<WorkOrderDto>>(
                Constants.ApiEndpoints.WorkOrders, filters);

            _hasMore = (_currentPage * Constants.DefaultPageSize) < response.Total;
            _currentPage++;

            foreach (var wo in response.Data)
                WorkOrders.Add(wo);

            TotalText = $"{WorkOrders.Count} de {response.Total} órdenes";
        });
    }
}
