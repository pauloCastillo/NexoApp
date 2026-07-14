using FluentAssertions;
using Nexo.Desktop.Tests.Mocks;
using NUnit.Framework;

namespace Nexo.Desktop.Tests.Services;

public class ApiServiceTests
{
    [Test]
    public async Task GetAsync_WithFilters_BuildsQueryString()
    {
        var api = new MockApiService();
        api.SetupResponse("api/time-controls", new { data = new[] { new { id = "1" } }, total = 1 });

        var filters = new Dictionary<string, string>
        {
            ["from"] = "2026-07-01",
            ["to"] = "2026-07-07"
        };

        var response = await api.GetAsync<dynamic>("api/time-controls", filters);

        api.CalledEndpoints.Should().Contain(e => e.Contains("api/time-controls"));
    }

    [Test]
    public async Task PostAsync_CallsCorrectEndpoint()
    {
        var api = new MockApiService();
        api.SetupResponse("auth/login", new { manager = new { id = "1" } });

        var body = new { email = "test@test.com", password = "pass" };
        var response = await api.PostAsync<dynamic>("auth/login", body);

        api.CalledEndpoints.Should().Contain("auth/login");
    }

    [Test]
    public void PatchAsync_MissingSetup_Throws()
    {
        var api = new MockApiService();

        Func<Task> act = async () => await api.PatchAsync<dynamic>("api/employees/1", new { role = "manager" });

        act.Should().ThrowAsync<Exception>().WithMessage("*No mock setup*");
    }
}
