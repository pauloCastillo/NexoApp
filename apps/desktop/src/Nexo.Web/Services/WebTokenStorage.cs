using Microsoft.JSInterop;
using Nexo.Desktop.Services;

namespace Nexo.Web.Services;

public class WebTokenStorage : ITokenStorage
{
    private readonly IJSRuntime _js;
    private const string AccessTokenKey = "nexo_access_token";
    private const string RefreshTokenKey = "nexo_refresh_token";

    public WebTokenStorage(IJSRuntime js)
    {
        _js = js;
    }

    public async Task<string?> GetAccessTokenAsync() =>
        await _js.InvokeAsync<string?>("localStorage.getItem", AccessTokenKey);

    public async Task<string?> GetRefreshTokenAsync() =>
        await _js.InvokeAsync<string?>("localStorage.getItem", RefreshTokenKey);

    public async Task SetTokensAsync(string accessToken, string refreshToken)
    {
        await _js.InvokeVoidAsync("localStorage.setItem", AccessTokenKey, accessToken);
        await _js.InvokeVoidAsync("localStorage.setItem", RefreshTokenKey, refreshToken);
    }

    public void ClearTokens()
    {
        _ = _js.InvokeVoidAsync("localStorage.removeItem", AccessTokenKey);
        _ = _js.InvokeVoidAsync("localStorage.removeItem", RefreshTokenKey);
    }
}
