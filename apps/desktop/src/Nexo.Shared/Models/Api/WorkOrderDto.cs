using System.Text.Json.Serialization;

namespace Nexo.Desktop.Models.Api;

public class WorkOrderDto
{
    [JsonPropertyName("_id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("employee")]
    public string Employee { get; set; } = string.Empty;

    [JsonPropertyName("company")]
    public string Company { get; set; } = string.Empty;

    [JsonPropertyName("client")]
    public string? Client { get; set; }

    [JsonPropertyName("clientName")]
    public string? ClientName { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("date")]
    public DateTime Date { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = "pendiente";

    [JsonPropertyName("completedAt")]
    public DateTime? CompletedAt { get; set; }

    [JsonPropertyName("cancelledAt")]
    public DateTime? CancelledAt { get; set; }

    [JsonPropertyName("cancellationReason")]
    public string? CancellationReason { get; set; }
}
