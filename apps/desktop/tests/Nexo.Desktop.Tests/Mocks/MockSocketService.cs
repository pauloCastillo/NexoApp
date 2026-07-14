namespace Nexo.Desktop.Tests.Mocks;

public class MockSocketService
{
    public bool ConnectCalled { get; private set; }
    public bool DisconnectCalled { get; private set; }
    public bool SubscribeCalled { get; private set; }
    public string? LastCompanyId { get; private set; }
    public bool IsConnected { get; set; }

    public event Action<bool>? OnConnectionChanged;
    public event Action<TimeControlEvent>? OnTimeControlCreated;
    public event Action<DashboardStatsEvent>? OnDashboardStats;

    public Task ConnectAsync()
    {
        ConnectCalled = true;
        IsConnected = true;
        OnConnectionChanged?.Invoke(true);
        return Task.CompletedTask;
    }

    public Task DisconnectAsync()
    {
        DisconnectCalled = true;
        IsConnected = false;
        return Task.CompletedTask;
    }

    public Task SubscribeToDashboardAsync(string companyId)
    {
        SubscribeCalled = true;
        LastCompanyId = companyId;
        return Task.CompletedTask;
    }

    public void SimulateTimeControl(TimeControlEvent evt)
    {
        OnTimeControlCreated?.Invoke(evt);
    }

    public void SimulateStatsUpdate(DashboardStatsEvent evt)
    {
        OnDashboardStats?.Invoke(evt);
    }
}

// DTOs duplicated for test independence
public class TimeControlEvent
{
    public string EmployeeId { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public bool Late { get; set; }
}

public class DashboardStatsEvent
{
    public int CheckedIn { get; set; }
    public int OnBreak { get; set; }
    public int ActiveEmployees { get; set; }
    public int LateEmployees { get; set; }
    public string? AvgHours { get; set; }
}

public class DashboardStats
{
    public int CheckedIn { get; set; }
    public int OnBreak { get; set; }
    public int ActiveEmployees { get; set; }
    public int LateEmployees { get; set; }
    public int TotalEmployees { get; set; }
    public string? AvgHours { get; set; }
}

public class TodayTimeControlResponse
{
    public List<TimeControlItem> Data { get; set; } = [];
    public DashboardStats? Stats { get; set; }
}

public class TimeControlItem
{
    public string Id { get; set; } = string.Empty;
    public EmployeeSummary? Employee { get; set; }
    public string Company { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string? Entrada { get; set; }
    public string? Descanso { get; set; }
    public string? Retorno { get; set; }
    public string? Salida { get; set; }
    public bool Late { get; set; }
}

public class EmployeeSummary
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
}

public class PaginatedResponse<T>
{
    public List<T> Data { get; set; } = [];
    public int Total { get; set; }
    public int Page { get; set; }
    public int Limit { get; set; }
}
