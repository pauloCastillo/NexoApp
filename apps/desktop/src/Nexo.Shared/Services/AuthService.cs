using System.Text.Json;
using Nexo.Desktop.Helpers;
using Nexo.Desktop.Models.Api;
using Nexo.Desktop.Models.Domain;

namespace Nexo.Desktop.Services;

public class AuthService
{
    private readonly ApiService _api;
    private readonly ITokenStorage _tokenStorage;
    private UserSession? _currentSession;
    private bool _isRefreshing;
    private readonly List<Func<Task>> _onLogoutCallbacks = [];

    public event Action? SessionChanged;

    public AuthService(ApiService api, ITokenStorage tokenStorage)
    {
        _api = api;
        _tokenStorage = tokenStorage;
    }

    public async Task<UserSession?> GetSessionAsync()
    {
        if (_currentSession?.IsAuthenticated == true)
            return _currentSession;

        return await TryRestoreSessionAsync();
    }

    public async Task<UserSession> LoginAsync(string email, string password)
    {
        var request = new LoginRequest { Email = email, Password = password };
        var response = await _api.PostAsync<LoginResponse>("/auth/login", request);

        if (response.Manager == null)
            throw new UnauthorizedException("Credenciales inválidas");

        var session = new UserSession
        {
            UserId = response.Manager.Id,
            Username = response.Manager.Username,
            Email = response.Manager.Email,
            Role = response.Manager.Role,
            AccessToken = response.Manager.Token,
            RefreshToken = response.Manager.RefreshToken
        };

        _currentSession = session;
        await PersistSessionAsync(session);
        SessionChanged?.Invoke();
        return session;
    }

    public async Task<bool> TryRefreshTokenAsync()
    {
        if (_isRefreshing) return false;
        _isRefreshing = true;

        try
        {
            var session = await GetSessionAsync();
            if (session == null || string.IsNullOrEmpty(session.RefreshToken))
                return false;

            var request = new RefreshRequest { RefreshToken = session.RefreshToken };
            var response = await _api.PostAsync<RefreshResponse>("/auth/refresh", request);

            session.AccessToken = response.Token;
            session.RefreshToken = response.RefreshToken;
            await PersistSessionAsync(session);
            SessionChanged?.Invoke();
            return true;
        }
        catch
        {
            await LogoutAsync();
            return false;
        }
        finally
        {
            _isRefreshing = false;
        }
    }

    public async Task LogoutAsync()
    {
        _currentSession = null;
        _tokenStorage.ClearTokens();
        SessionChanged?.Invoke();

        foreach (var cb in _onLogoutCallbacks)
            await cb();
    }

    public void OnLogout(Func<Task> callback) => _onLogoutCallbacks.Add(callback);

    private async Task<UserSession?> TryRestoreSessionAsync()
    {
        try
        {
            var json = await _tokenStorage.GetAccessTokenAsync();
            if (string.IsNullOrEmpty(json)) return null;

            _currentSession = new UserSession { AccessToken = json };
            return _currentSession;
        }
        catch
        {
            return null;
        }
    }

    private async Task PersistSessionAsync(UserSession session)
    {
        await _tokenStorage.SetTokensAsync(session.AccessToken, session.RefreshToken ?? "");
    }
}
