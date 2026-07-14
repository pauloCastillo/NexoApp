namespace Nexo.Desktop.Services;

public interface ITokenStorage
{
    Task<string?> GetAccessTokenAsync();
    Task<string?> GetRefreshTokenAsync();
    Task SetTokensAsync(string accessToken, string refreshToken);
    void ClearTokens();
}
