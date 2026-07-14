using System.Text.Json.Serialization;

namespace Nexo.Desktop.Models.Api;

public class PaginatedResponse<T>
{
    [JsonPropertyName("data")]
    public List<T> Data { get; set; } = [];

    [JsonPropertyName("total")]
    public int Total { get; set; }

    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("limit")]
    public int Limit { get; set; }
}
