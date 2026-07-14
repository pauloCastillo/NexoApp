using FluentAssertions;
using Nexo.Desktop.Tests.Mocks;
using NUnit.Framework;

namespace Nexo.Desktop.Tests.ViewModels;

public class EmployeeListViewModelTests
{
    [Test]
    public async Task Load_FetchesPaginatedEmployees()
    {
        var api = new MockApiService();
        var auth = new MockAuthService { CurrentSession = CreateSession() };

        api.SetupResponse("api/employees?page=1&limit=50", new PaginatedResponse<EmployeeItem>
        {
            Data =
            [
                new() { Id = "1", Username = "Juan", Email = "juan@test.com", Role = "employee" },
                new() { Id = "2", Username = "Ana", Email = "ana@test.com", Role = "manager" }
            ],
            Total = 2,
            Page = 1,
            Limit = 50
        });

        var vm = new EmployeeListViewModelStub(api, auth);
        await vm.LoadAsync();

        vm.Employees.Count.Should().Be(2);
        vm.TotalText.Should().Be("2 de 2 empleados");
    }

    [Test]
    public async Task Search_FiltersResults()
    {
        var api = new MockApiService();
        var auth = new MockAuthService { CurrentSession = CreateSession() };

        api.SetupResponse("api/employees?page=1&limit=50&search=Juan", new PaginatedResponse<EmployeeItem>
        {
            Data = [new() { Id = "1", Username = "Juan", Email = "juan@test.com", Role = "employee" }],
            Total = 1,
            Page = 1,
            Limit = 50
        });

        var vm = new EmployeeListViewModelStub(api, auth);
        vm.SearchQuery = "Juan";
        await vm.SearchAsync();

        vm.Employees.Count.Should().Be(1);
        vm.Employees[0].Username.Should().Be("Juan");
    }

    private static UserSession CreateSession() => new()
    {
        UserId = "admin-id", Role = "manager", CompanyId = "c1", AccessToken = "tok"
    };
}

public class EmployeeItem
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class EmployeeListViewModelStub
{
    private readonly MockApiService _api;
    private readonly MockAuthService _auth;
    public List<EmployeeItem> Employees { get; } = [];
    public string? ErrorMessage { get; set; }
    public string SearchQuery { get; set; } = string.Empty;
    public string TotalText { get; set; } = string.Empty;

    public EmployeeListViewModelStub(MockApiService api, MockAuthService auth)
    {
        _api = api;
        _auth = auth;
    }

    public async Task LoadAsync()
    {
        await ExecuteSafe(async () =>
        {
            var filters = new Dictionary<string, string> { ["page"] = "1", ["limit"] = "50" };
            var response = await _api.GetAsync<PaginatedResponse<EmployeeItem>>("api/employees?page=1&limit=50", filters);
            Employees.Clear();
            Employees.AddRange(response.Data);
            TotalText = $"{response.Data.Count} de {response.Total} empleados";
        });
    }

    public async Task SearchAsync()
    {
        await ExecuteSafe(async () =>
        {
            var filters = new Dictionary<string, string> { ["page"] = "1", ["limit"] = "50", ["search"] = SearchQuery };
            var response = await _api.GetAsync<PaginatedResponse<EmployeeItem>>($"api/employees?page=1&limit=50&search={SearchQuery}", filters);
            Employees.Clear();
            Employees.AddRange(response.Data);
        });
    }

    private async Task ExecuteSafe(Func<Task> action)
    {
        try { await action(); }
        catch (Exception ex) { ErrorMessage = ex.Message; }
    }
}
