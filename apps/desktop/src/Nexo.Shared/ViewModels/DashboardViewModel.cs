using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Nexo.Desktop.Helpers;
using Nexo.Desktop.Models.Api;
using Nexo.Desktop.Models.Domain;
using Nexo.Desktop.Services;

namespace Nexo.Desktop.ViewModels;

public partial class DashboardViewModel : BaseViewModel
{
    private readonly SocketService _socket;
    private string? _currentCompanyId;

    [ObservableProperty]
    private DashboardStats? _stats;

    [ObservableProperty]
    private bool _isSocketConnected;

    [ObservableProperty]
    private string _socketStatusText = "Desconectado";

    [ObservableProperty]
    private string _socketStatusColor = "#E53935";

    [ObservableProperty]
    private string _selectedPeriod = "Día";

    public List<DashboardCard> KpiCards { get; } = [];
    public ObservableCollection<TimeControlDto> TimeControls { get; } = [];

    public List<string> Periods { get; } = ["Día", "Semana", "Mes"];

    public DashboardViewModel(ApiService api, INavigationService navigation, AuthService authService, IConnectivityService connectivity, SocketService socket)
        : base(api, navigation, authService, connectivity)
    {
        _socket = socket;

        _socket.OnConnectionChanged += OnSocketConnectionChanged;
        _socket.OnTimeControlCreated += OnNewTimeControl;
        _socket.OnDashboardStats += OnStatsUpdated;
        _socket.OnEmployeeStatus += OnEmployeeStatusChanged;

        KpiCards.AddRange([
            new() { Title = "Marcaron Hoy", Value = "0", Icon = "✅", CardColor = "#E8F5E9", TextColor = "#2E7D32" },
            new() { Title = "En Trabajo", Value = "0", Icon = "💼", CardColor = "#E3F2FD", TextColor = "#1565C0" },
            new() { Title = "En Descanso", Value = "0", Icon = "☕", CardColor = "#FFF3E0", TextColor = "#E65100" },
            new() { Title = "Atrasados", Value = "0", Icon = "⚠️", CardColor = "#FFEBEE", TextColor = "#C62828" },
        ]);
    }

    [RelayCommand]
    private async Task LoadAsync()
    {
        await ExecuteSafe(async () =>
        {
            var session = await GetSessionAsync();
            if (session == null) return;

            var todayResponse = await Api.GetAsync<TodayTimeControlResponse>(
                Constants.ApiEndpoints.TimeControlsToday);

            if (todayResponse.Stats != null)
                Stats = todayResponse.Stats;

            TimeControls.Clear();
            foreach (var tc in todayResponse.Data)
                TimeControls.Add(tc);

            UpdateKpiCards(todayResponse.Stats);
        });

        await ConnectSocketAsync();
    }

    [RelayCommand]
    private async Task RefreshAsync()
    {
        IsRefreshing = true;
        await LoadAsync();
    }

    [RelayCommand]
    private async Task ChangePeriodAsync(string period)
    {
        SelectedPeriod = period;
        if (period == "Día")
        {
            await LoadAsync();
            return;
        }

        await ExecuteSafe(async () =>
        {
            var from = DateTime.UtcNow.AddDays(period == "Semana" ? -7 : -30);
            var filters = new Dictionary<string, string>
            {
                ["from"] = from.ToString("yyyy-MM-dd"),
                ["to"] = DateTime.UtcNow.ToString("yyyy-MM-dd")
            };

            var response = await Api.GetAsync<PaginatedResponse<TimeControlDto>>(
                Constants.ApiEndpoints.TimeControls, filters);

            TimeControls.Clear();
            foreach (var tc in response.Data)
                TimeControls.Add(tc);
        });
    }

    private async Task ConnectSocketAsync()
    {
        try
        {
            await _socket.ConnectAsync();
            var session = await GetSessionAsync();
            if (session?.CompanyId != null)
            {
                _currentCompanyId = session.CompanyId;
                await _socket.SubscribeToDashboardAsync(session.CompanyId);
            }
        }
        catch
        {
            UpdateSocketStatus(false);
        }
    }

    private void OnSocketConnectionChanged(bool connected)
    {
        UpdateSocketStatus(connected);
    }

    private void UpdateSocketStatus(bool connected)
    {
        IsSocketConnected = connected;
        SocketStatusText = connected ? "Conectado" : "Desconectado";
        SocketStatusColor = connected ? "#4CAF50" : "#E53935";
    }

    private void OnNewTimeControl(TimeControlEvent evt)
    {
        var displayName = evt.EmployeeName;
        TimeControls.Insert(0, new TimeControlDto
        {
            Employee = new EmployeeSummary { Username = displayName },
            Entrada = evt.Time,
            Late = evt.Late
        });
    }

    private void OnStatsUpdated(DashboardStatsEvent evt)
    {
        if (Stats == null) return;
        Stats.CheckedIn = evt.CheckedIn;
        Stats.OnBreak = evt.OnBreak;
        Stats.ActiveEmployees = evt.ActiveEmployees;
        Stats.LateEmployees = evt.LateEmployees;
        Stats.AvgHours = evt.AvgHours;
        UpdateKpiCards(Stats);
    }

    private void OnEmployeeStatusChanged(EmployeeStatusEvent evt)
    {
        OnPropertyChanged(nameof(Stats));
    }

    private void UpdateKpiCards(DashboardStats? s)
    {
        if (s == null) return;
        KpiCards[0].Value = s.CheckedIn.ToString();
        KpiCards[0].Subtitle = $"de {s.TotalEmployees} empleados";
        KpiCards[1].Value = s.ActiveEmployees.ToString();
        KpiCards[1].Subtitle = s.AvgHours ?? "";
        KpiCards[2].Value = s.OnBreak.ToString();
        KpiCards[2].Subtitle = "en pausa";
        KpiCards[3].Value = s.LateEmployees.ToString();
        KpiCards[3].Subtitle = "llegaron después de inicio";
    }
}
