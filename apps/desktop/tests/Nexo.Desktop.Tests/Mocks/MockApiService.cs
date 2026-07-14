using System.Net;
using System.Text.Json;

namespace Nexo.Desktop.Tests.Mocks;

public class MockApiService
{
    private readonly Dictionary<string, object> _responses = new();
    private readonly List<string> _calledEndpoints = new();
    public IReadOnlyList<string> CalledEndpoints => _calledEndpoints.AsReadOnly();

    public void SetupResponse<T>(string endpoint, T response)
    {
        _responses[endpoint] = response!;
    }

    public async Task<T> GetAsync<T>(string endpoint, Dictionary<string, string>? queryParams = null)
    {
        _calledEndpoints.Add(endpoint);
        await Task.CompletedTask;

        if (_responses.TryGetValue(endpoint, out var response))
            return (T)response;

        throw new Exception($"No mock setup for {endpoint}");
    }

    public async Task<T> PostAsync<T>(string endpoint, object body)
    {
        _calledEndpoints.Add(endpoint);
        await Task.CompletedTask;

        if (_responses.TryGetValue(endpoint, out var response))
            return (T)response;

        throw new Exception($"No mock setup for {endpoint}");
    }

    public async Task<T> PatchAsync<T>(string endpoint, object body)
    {
        _calledEndpoints.Add(endpoint);
        await Task.CompletedTask;

        if (_responses.TryGetValue(endpoint, out var response))
            return (T)response;

        throw new Exception($"No mock setup for {endpoint}");
    }

    public void Reset() { _responses.Clear(); _calledEndpoints.Clear(); }
}
