using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Nexo.Desktop.Helpers;
using Nexo.Desktop.Models.Api;
using Nexo.Desktop.Services;

namespace Nexo.Desktop.ViewModels;

public partial class EmployeeListViewModel : BaseViewModel
{
    [ObservableProperty]
    private string _searchQuery = string.Empty;

    [ObservableProperty]
    private string _selectedDepartment = string.Empty;

    [ObservableProperty]
    private string _totalText = string.Empty;

    public ObservableCollection<EmployeeDto> Employees { get; } = [];
    public List<string> Departments { get; } = [];

    private int _currentPage = 1;
    private int _totalItems;
    private bool _hasMore = true;

    public EmployeeListViewModel(ApiService api, INavigationService navigation, AuthService authService, IConnectivityService connectivity)
        : base(api, navigation, authService, connectivity) { }

    [RelayCommand]
    private async Task LoadAsync()
    {
        _currentPage = 1;
        Employees.Clear();
        await LoadPageAsync();
    }

    [RelayCommand]
    private async Task LoadMoreAsync()
    {
        if (!_hasMore || IsBusy) return;
        await LoadPageAsync();
    }

    [RelayCommand]
    private async Task SearchAsync()
    {
        await LoadAsync();
    }

    [RelayCommand]
    private async Task RefreshAsync()
    {
        IsRefreshing = true;
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

            if (!string.IsNullOrWhiteSpace(SearchQuery))
                filters["search"] = SearchQuery;

            var response = await Api.GetAsync<PaginatedResponse<EmployeeDto>>(
                Constants.ApiEndpoints.Employees, filters);

            _totalItems = response.Total;
            _hasMore = (_currentPage * Constants.DefaultPageSize) < _totalItems;
            _currentPage++;

            foreach (var emp in response.Data)
                Employees.Add(emp);

            TotalText = $"{Employees.Count} de {_totalItems} empleados";
        });
    }
}
