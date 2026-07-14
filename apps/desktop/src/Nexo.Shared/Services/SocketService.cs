using System.Text.Json;
using Nexo.Desktop.Helpers;
using Nexo.Desktop.Models.Domain;
using SocketIOClient;

namespace Nexo.Desktop.Services;

public class SocketService : IDisposable
{
    private SocketIOClient.SocketIO? _socket;
    private readonly AuthService _authService;
    private bool _isConnected;
    private bool _isReconnecting;

    public bool IsConnected => _isConnected;
    public bool IsReconnecting => _isReconnecting;

    public event Action<string, string>? OnNotification;
    public event Action<TimeControlEvent>? OnTimeControlCreated;
    public event Action<DashboardStatsEvent>? OnDashboardStats;
    public event Action<EmployeeStatusEvent>? OnEmployeeStatus;
    public event Action<bool>? OnConnectionChanged;

    public SocketService(AuthService authService)
    {
        _authService = authService;
        _authService.OnLogout(async () => await DisconnectAsync());
    }

    public async Task ConnectAsync()
    {
        if (_socket?.Connected == true) return;

        var session = await _authService.GetSessionAsync();
        if (session == null) return;

        _socket = new SocketIOClient.SocketIO(Constants.ApiBaseUrl, new SocketIOOptions
        {
            Auth = new { token = session.AccessToken },
            Reconnection = true,
            ReconnectionAttempts = Constants.SocketReconnectMaxAttempts,
            ReconnectionDelay = (int)Constants.SocketReconnectBaseDelayMs
        });

        RegisterHandlers();
        await _socket.ConnectAsync();
    }

    public async Task DisconnectAsync()
    {
        if (_socket == null) return;
        await _socket.DisconnectAsync();
        _socket.Dispose();
        _socket = null;
        _isConnected = false;
        OnConnectionChanged?.Invoke(false);
    }

    public async Task SubscribeToDashboardAsync(string companyId)
    {
        if (_socket?.Connected == true)
            await _socket.EmitAsync(Constants.SocketEvents.Subscribe, new { companyId });
    }

    public async Task UnsubscribeFromDashboardAsync(string companyId)
    {
        if (_socket?.Connected == true)
            await _socket.EmitAsync(Constants.SocketEvents.Unsubscribe, new { companyId });
    }

    private void RegisterHandlers()
    {
        if (_socket == null) return;

        _socket.OnConnected += (_, _) =>
        {
            _isConnected = true;
            _isReconnecting = false;
            OnConnectionChanged?.Invoke(true);
        };

        _socket.OnDisconnected += (_, _) =>
        {
            _isConnected = false;
            OnConnectionChanged?.Invoke(false);
        };

        _socket.OnReconnectAttempt += (_, _) =>
        {
            _isReconnecting = true;
        };

        _socket.OnReconnected += async (_, _) =>
        {
            _isConnected = true;
            _isReconnecting = false;
            OnConnectionChanged?.Invoke(true);

            var session = await _authService.GetSessionAsync();
            if (session?.CompanyId != null)
                await SubscribeToDashboardAsync(session.CompanyId);
        };

        _socket.On(Constants.SocketEvents.TimeControlCreated, response =>
        {
            var data = DeserializeEvent<TimeControlEvent>(response);
            if (data != null)
                OnTimeControlCreated?.Invoke(data);
        });

        _socket.On(Constants.SocketEvents.DashboardStats, response =>
        {
            var data = DeserializeEvent<DashboardStatsEvent>(response);
            if (data != null)
                OnDashboardStats?.Invoke(data);
        });

        _socket.On(Constants.SocketEvents.EmployeeOnline, response =>
        {
            var data = DeserializeEvent<EmployeeStatusEvent>(response);
            if (data != null)
                OnEmployeeStatus?.Invoke(data);
        });

        _socket.On(Constants.SocketEvents.EmployeeOffline, response =>
        {
            var data = DeserializeEvent<EmployeeStatusEvent>(response);
            if (data != null)
                OnEmployeeStatus?.Invoke(data);
        });

        _socket.On(Constants.SocketEvents.NotificationNew, response =>
        {
            var data = DeserializeEvent<Dictionary<string, string>>(response);
            if (data != null)
            {
                var type = data.GetValueOrDefault("type", "info");
                var message = data.GetValueOrDefault("message", "");
                OnNotification?.Invoke(type, message);
            }
        });
    }

    private static T? DeserializeEvent<T>(SocketIOResponse response) where T : class
    {
        try
        {
            var json = response.GetValue<JsonElement>(0);
            return JsonSerializer.Deserialize<T>(json.GetRawText());
        }
        catch { return null; }
    }

    public void Dispose()
    {
        _socket?.Dispose();
    }
}
