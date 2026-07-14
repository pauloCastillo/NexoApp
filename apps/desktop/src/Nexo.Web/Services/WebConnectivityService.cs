using Microsoft.JSInterop;
using Nexo.Desktop.Services;

namespace Nexo.Web.Services;

public class WebConnectivityService : IConnectivityService, IAsyncDisposable
{
    private readonly IJSRuntime _js;
    private DotNetObjectReference<WebConnectivityService>? _ref;

    public bool IsOnline { get; private set; } = true;

    public event Action<bool>? ConnectivityChanged;

    public WebConnectivityService(IJSRuntime js)
    {
        _js = js;
    }

    public async Task InitializeAsync()
    {
        _ref = DotNetObjectReference.Create(this);
        IsOnline = await _js.InvokeAsync<bool>("nexoConnectivity.init", _ref);
    }

    [JSInvokable]
    public void OnStatusChanged(bool online)
    {
        if (IsOnline != online)
        {
            IsOnline = online;
            ConnectivityChanged?.Invoke(online);
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_ref is not null)
            await _js.InvokeVoidAsync("nexoConnectivity.dispose", _ref);
        _ref?.Dispose();
    }
}
