using FluentAssertions;
using Nexo.Desktop.Tests.Mocks;
using NUnit.Framework;

namespace Nexo.Desktop.Tests.Services;

public class AuthServiceTests
{
    [Test]
    public async Task Login_ValidCredentials_ReturnsSession()
    {
        var api = new MockApiService();
        api.SetupResponse("auth/login", new
        {
            message = "bienvenido",
            manager = new
            {
                id = "mgr-1",
                username = "Admin",
                email = "admin@test.com",
                role = "manager",
                token = "access-token-123",
                refreshToken = "refresh-token-456"
            }
        });

        var auth = new MockAuthService();
        var session = await auth.LoginAsync("admin@test.com", "pass");

        session.Should().NotBeNull();
        session.IsAuthenticated.Should().BeTrue();
        session.Role.Should().Be("manager");
        session.Email.Should().Be("admin@test.com");
    }

    [Test]
    public async Task Logout_ClearsSession()
    {
        var auth = new MockAuthService();
        await auth.LoginAsync("admin@test.com", "pass");
        auth.CurrentSession.Should().NotBeNull();

        await auth.LogoutAsync();
        auth.CurrentSession.Should().BeNull();
        auth.LogoutCalled.Should().BeTrue();
    }

    [Test]
    public void Superuser_HasElevatedAccess()
    {
        var session = new UserSession
        {
            UserId = "su-1",
            Role = "superuser",
            AccessToken = "tok"
        };

        session.IsSuperuser.Should().BeTrue();
        session.IsManager.Should().BeTrue();
    }

    [Test]
    public void Viewer_HasLimitedAccess()
    {
        var session = new UserSession
        {
            UserId = "v-1",
            Role = "viewer",
            AccessToken = "tok"
        };

        session.IsSuperuser.Should().BeFalse();
        session.IsManager.Should().BeFalse();
    }
}
