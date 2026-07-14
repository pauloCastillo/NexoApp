using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Nexo.Desktop.Helpers;

namespace Nexo.Desktop.Services;

public class ApiException : Exception
{
    public int StatusCode { get; }
    public ApiException(int statusCode, string message) : base(message) => StatusCode = statusCode;
}

public class UnauthorizedException : ApiException
{
    public UnauthorizedException(string message = "No autorizado") : base(401, message) { }
}

public class ForbiddenException : ApiException
{
    public ForbiddenException(string message = "No tienes permiso") : base(403, message) { }
}

public class NotFoundException : ApiException
{
    public NotFoundException(string message = "Recurso no encontrado") : base(404, message) { }
}

public class ValidationException : ApiException
{
    public ValidationException(string message = "Datos inválidos") : base(422, message) { }
}

public class ApiService
{
    private readonly HttpClient _httpClient;
    private readonly AuthService _authService;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public ApiService(HttpClient httpClient, AuthService authService)
    {
        _httpClient = httpClient;
        _authService = authService;
        _httpClient.BaseAddress = new Uri(Constants.ApiBaseUrl);
        _httpClient.DefaultRequestHeaders.Add("User-Agent", Constants.MobileUserAgent);
    }

    public async Task<T> GetAsync<T>(string endpoint, Dictionary<string, string>? queryParams = null)
    {
        var url = BuildUrl(endpoint, queryParams);
        await AttachTokenAsync();
        var response = await _httpClient.GetAsync(url);
        return await HandleResponse<T>(response);
    }

    public async Task<T> PostAsync<T>(string endpoint, object body)
    {
        var url = BuildUrl(endpoint);
        await AttachTokenAsync();
        var json = JsonSerializer.Serialize(body, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(url, content);
        return await HandleResponse<T>(response);
    }

    public async Task<T> PatchAsync<T>(string endpoint, object body)
    {
        var url = BuildUrl(endpoint);
        await AttachTokenAsync();
        var json = JsonSerializer.Serialize(body, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await _httpClient.PatchAsync(url, content);
        return await HandleResponse<T>(response);
    }

    public async Task<T> PutAsync<T>(string endpoint, object body)
    {
        var url = BuildUrl(endpoint);
        await AttachTokenAsync();
        var json = JsonSerializer.Serialize(body, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await _httpClient.PutAsync(url, content);
        return await HandleResponse<T>(response);
    }

    public async Task DeleteAsync(string endpoint)
    {
        var url = BuildUrl(endpoint);
        await AttachTokenAsync();
        var response = await _httpClient.DeleteAsync(url);
        if (!response.IsSuccessStatusCode)
            await ThrowByStatus(response);
    }

    public async Task<byte[]> GetBytesAsync(string endpoint, Dictionary<string, string>? queryParams = null)
    {
        var url = BuildUrl(endpoint, queryParams);
        await AttachTokenAsync();
        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsByteArrayAsync();
    }

    private static string BuildUrl(string endpoint, Dictionary<string, string>? queryParams = null)
    {
        if (queryParams == null || queryParams.Count == 0)
            return endpoint;

        var qs = string.Join("&", queryParams.Select(kv =>
            $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value)}"));
        return $"{endpoint}?{qs}";
    }

    private async Task AttachTokenAsync()
    {
        var session = await _authService.GetSessionAsync();
        if (session?.AccessToken != null)
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", session.AccessToken);
        }
    }

    private static async Task<T> HandleResponse<T>(HttpResponseMessage response)
    {
        if (!response.IsSuccessStatusCode)
            await ThrowByStatus(response);

        var body = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<T>(body, JsonOptions)
            ?? throw new InvalidOperationException("Respuesta vacía del servidor");
    }

    private static async Task ThrowByStatus(HttpResponseMessage response)
    {
        var body = await response.Content.ReadAsStringAsync();
        var message = TryExtractMessage(body) ?? $"Error HTTP {(int)response.StatusCode}";

        throw response.StatusCode switch
        {
            System.Net.HttpStatusCode.Unauthorized => new UnauthorizedException(message),
            System.Net.HttpStatusCode.Forbidden => new ForbiddenException(message),
            System.Net.HttpStatusCode.NotFound => new NotFoundException(message),
            System.Net.HttpStatusCode.UnprocessableEntity => new ValidationException(message),
            _ => new ApiException((int)response.StatusCode, message)
        };
    }

    private static string? TryExtractMessage(string body)
    {
        try
        {
            using var doc = JsonDocument.Parse(body);
            return doc.RootElement.TryGetProperty("message", out var msg) ? msg.GetString() : null;
        }
        catch { return null; }
    }
}
