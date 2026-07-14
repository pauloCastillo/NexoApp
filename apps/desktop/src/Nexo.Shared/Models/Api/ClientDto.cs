using System.Text.Json.Serialization;

namespace Nexo.Desktop.Models.Api;

public class ClientDto
{
    [JsonPropertyName("_id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("companyName")]
    public string CompanyName { get; set; } = string.Empty;

    [JsonPropertyName("company")]
    public string Company { get; set; } = string.Empty;

    [JsonPropertyName("contactName")]
    public string ContactName { get; set; } = string.Empty;

    [JsonPropertyName("contactLastName")]
    public string ContactLastName { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    public string FullName => $"{ContactName} {ContactLastName}";
}
