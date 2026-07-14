using System.Text.Json.Serialization;

namespace Nexo.Desktop.Models.Api;

public class VacationDto
{
    [JsonPropertyName("_id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("employee")]
    public string Employee { get; set; } = string.Empty;

    [JsonPropertyName("company")]
    public string Company { get; set; } = string.Empty;

    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }

    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = "pendiente";
}
