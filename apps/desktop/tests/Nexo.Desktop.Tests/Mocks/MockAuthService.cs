using System.Text.Json;

namespace Nexo.Desktop.Tests.Mocks;

public class MockAuthService
{
    public UserSession? CurrentSession { get; set; }
    public bool LoginCalled { get; private set; }
    public bool LogoutCalled { get; private set; }
    public string? LastLoginEmail { get; private set; }

    public event Action? SessionChanged;

    public Task<UserSession?> GetSessionAsync() => Task.FromResult(CurrentSession);

    public Task<UserSession> LoginAsync(string email, string password)
    {
        LoginCalled = true;
        LastLoginEmail = email;

        var session = new UserSession
        {
            UserId = "mock-user-id",
            Username = "Test User",
            Email = email,
            Role = "manager",
            CompanyId = "mock-company",
            AccessToken = "mock-access-token",
            RefreshToken = "mock-refresh-token"
        };

        CurrentSession = session;
        SessionChanged?.Invoke();
        return Task.FromResult(session);
    }

    public Task LogoutAsync()
    {
        LogoutCalled = true;
        CurrentSession = null;
        SessionChanged?.Invoke();
        return Task.CompletedTask;
    }

    public Task<bool> TryRefreshTokenAsync() => Task.FromResult(true);
}

public class UserSession
{
    public string UserId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? CompanyId { get; set; }
    public string UserType { get; set; } = "manager";
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public bool IsAuthenticated => !string.IsNullOrEmpty(AccessToken);
    public bool IsSuperuser => Role == "superuser";
    public bool IsManager => Role is "manager" or "superuser";
}
