using FluentAssertions;
using Nexo.Desktop.Tests.Mocks;
using NUnit.Framework;

namespace Nexo.Desktop.Tests.ViewModels;

public class DashboardViewModelTests
{
    [Test]
    public async Task Load_FetchesTodayTimeControls()
    {
        var api = new MockApiService();
        var auth = new MockAuthService { CurrentSession = CreateTestSession() };
        var socket = new MockSocketService();

        api.SetupResponse("api/time-controls/today", new TodayTimeControlResponse
        {
            Data =
            [
                new() { Employee = new EmployeeSummary { Username = "Juan" }, Entrada = "08:15" },
                new() { Employee = new EmployeeSummary { Username = "María" }, Entrada = "08:30" }
            ],
            Stats = new DashboardStats
            {
                CheckedIn = 2,
                ActiveEmployees = 2,
                OnBreak = 0,
                LateEmployees = 0,
                TotalEmployees = 5,
                AvgHours = "8h00m"
            }
        });

        var vm = new DashboardViewModelStub(api, auth, socket);
        await vm.LoadAsync();

        vm.Loaded.Should().BeTrue();
        vm.TimeControlCount.Should().Be(2);
        vm.CheckedIn.Should().Be(2);
    }

    [Test]
    public async Task Load_WithNoSession_Fails()
    {
        var api = new MockApiService();
        var auth = new MockAuthService { CurrentSession = null };
        var socket = new MockSocketService();

        var vm = new DashboardViewModelStub(api, auth, socket);
        await vm.LoadAsync();

        vm.Loaded.Should().BeFalse();
    }

    [Test]
    public async Task Socket_ReceivingNewPunch_UpdatesTimeline()
    {
        var api = new MockApiService();
        var auth = new MockAuthService { CurrentSession = CreateTestSession() };
        var socket = new MockSocketService();

        api.SetupResponse("api/time-controls/today", new TodayTimeControlResponse
        {
            Data = [],
            Stats = new DashboardStats { CheckedIn = 0, ActiveEmployees = 0, OnBreak = 0, LateEmployees = 0, TotalEmployees = 5 }
        });

        var vm = new DashboardViewModelStub(api, auth, socket);
        await vm.LoadAsync();
        int initialCount = vm.TimeControlCount;

        socket.SimulateTimeControl(new TimeControlEvent
        {
            EmployeeName = "Pedro",
            Time = "09:00",
            Label = "entrada"
        });

        vm.TimeControlCount.Should().Be(initialCount + 1);
    }

    private static UserSession CreateTestSession() => new()
    {
        UserId = "test-id",
        Username = "Admin",
        Email = "admin@test.com",
        Role = "manager",
        CompanyId = "company-1",
        AccessToken = "token"
    };
}

public class DashboardViewModelStub
{
    private readonly MockApiService _api;
    private readonly MockAuthService _auth;
    private readonly MockSocketService _socket;
    private readonly List<object> _timeControls = [];

    public bool Loaded { get; private set; }
    public int TimeControlCount => _timeControls.Count;
    public int CheckedIn { get; private set; }
    public string? ErrorMessage { get; set; }

    public DashboardViewModelStub(MockApiService api, MockAuthService auth, MockSocketService socket)
    {
        _api = api;
        _auth = auth;
        _socket = socket;

        _socket.OnTimeControlCreated += OnTimeControl;
    }

    public async Task LoadAsync()
    {
        var session = await _auth.GetSessionAsync();
        if (session == null) return;

        try
        {
            var response = await _api.GetAsync<TodayTimeControlResponse>("api/time-controls/today");
            if (response.Stats != null)
                CheckedIn = response.Stats.CheckedIn;

            _timeControls.Clear();
            _timeControls.AddRange(response.Data);
            Loaded = true;
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }

        await _socket.ConnectAsync();
        if (session.CompanyId != null)
            await _socket.SubscribeToDashboardAsync(session.CompanyId);
    }

    private void OnTimeControl(TimeControlEvent evt)
    {
        _timeControls.Insert(0, evt);
    }
}
