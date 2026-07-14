using System.Text.Json.Serialization;

namespace Nexo.Desktop.Models.Api;

public class TimeControlDto
{
    [JsonPropertyName("_id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("employee")]
    public EmployeeSummary? Employee { get; set; }

    [JsonPropertyName("company")]
    public string Company { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public DateTime Date { get; set; }

    [JsonPropertyName("entrada")]
    public string? Entrada { get; set; }

    [JsonPropertyName("descanso")]
    public string? Descanso { get; set; }

    [JsonPropertyName("retorno")]
    public string? Retorno { get; set; }

    [JsonPropertyName("salida")]
    public string? Salida { get; set; }

    [JsonPropertyName("location")]
    public LocationData? Location { get; set; }

    [JsonPropertyName("late")]
    public bool Late { get; set; }
}

public class EmployeeSummary
{
    [JsonPropertyName("_id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("role")]
    public string? Role { get; set; }
}

public class LocationData
{
    [JsonPropertyName("latitude")]
    public double Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; set; }

    [JsonPropertyName("street")]
    public string? Street { get; set; }
}

public class TodayTimeControlResponse
{
    [JsonPropertyName("data")]
    public List<TimeControlDto> Data { get; set; } = [];

    [JsonPropertyName("stats")]
    public DashboardStats? Stats { get; set; }
}

public class DashboardStats
{
    [JsonPropertyName("checkedIn")]
    public int CheckedIn { get; set; }

    [JsonPropertyName("onBreak")]
    public int OnBreak { get; set; }

    [JsonPropertyName("activeEmployees")]
    public int ActiveEmployees { get; set; }

    [JsonPropertyName("lateEmployees")]
    public int LateEmployees { get; set; }

    [JsonPropertyName("totalEmployees")]
    public int TotalEmployees { get; set; }

    [JsonPropertyName("avgHours")]
    public string? AvgHours { get; set; }
}

public class TimeLabels
{
    public const string Entrada = "entrada";
    public const string Descanso = "descanso";
    public const string Retorno = "retorno";
    public const string Salida = "salida";
}
