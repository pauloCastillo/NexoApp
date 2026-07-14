using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Nexo.Desktop.Helpers;
using Nexo.Desktop.Models.Api;
using Nexo.Desktop.Services;

namespace Nexo.Desktop.ViewModels;

public partial class EmployeeDetailViewModel : BaseViewModel
{
    [ObservableProperty]
    private string _employeeId = string.Empty;

    [ObservableProperty]
    private EmployeeDto? _employee;

    [ObservableProperty]
    private List<TimeControlDto> _todayTimeControls = [];

    public EmployeeDetailViewModel(ApiService api, INavigationService navigation, AuthService authService, IConnectivityService connectivity)
        : base(api, navigation, authService, connectivity) { }

    partial void OnEmployeeIdChanged(string value)
    {
        if (!string.IsNullOrEmpty(value))
            _ = LoadAsync();
    }

    [RelayCommand]
    private async Task LoadAsync()
    {
        if (string.IsNullOrEmpty(EmployeeId)) return;

        await ExecuteSafe(async () =>
        {
            var emp = await Api.GetAsync<EmployeeDto>(
                $"{Constants.ApiEndpoints.Employees}/{EmployeeId}");
            Employee = emp;

            var filters = new Dictionary<string, string>
            {
                ["employee"] = EmployeeId,
                ["from"] = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                ["to"] = DateTime.UtcNow.ToString("yyyy-MM-dd")
            };
            var tcResponse = await Api.GetAsync<PaginatedResponse<TimeControlDto>>(
                Constants.ApiEndpoints.TimeControls, filters);
            TodayTimeControls = tcResponse.Data;
        });
    }

    [RelayCommand]
    private async Task GoBackAsync()
    {
        await Navigation.GoBackAsync();
    }
}
