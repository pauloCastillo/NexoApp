namespace Nexo.Desktop.Services;

public class MauiTokenStorage : ITokenStorage
{
    private const string AccessTokenKey = "access_token";
    private const string RefreshTokenKey = "refresh_token";

    public async Task<string?> GetAccessTokenAsync() =>
        await SecureStorage.Default.GetAsync(AccessTokenKey);

    public async Task<string?> GetRefreshTokenAsync() =>
        await SecureStorage.Default.GetAsync(RefreshTokenKey);

    public async Task SetTokensAsync(string accessToken, string refreshToken)
    {
        await SecureStorage.Default.SetAsync(AccessTokenKey, accessToken);
        await SecureStorage.Default.SetAsync(RefreshTokenKey, refreshToken);
    }

    public void ClearTokens()
    {
        SecureStorage.Default.Remove(AccessTokenKey);
        SecureStorage.Default.Remove(RefreshTokenKey);
    }
}
