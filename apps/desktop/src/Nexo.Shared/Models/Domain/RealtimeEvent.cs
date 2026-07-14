using System.Text.Json.Serialization;

namespace Nexo.Desktop.Models.Domain;

public class RealtimeEvent<T>
{
    public string Event { get; set; } = string.Empty;
    public T? Data { get; set; }
}

public class TimeControlEvent
{
    [JsonPropertyName("employee")]
    public string EmployeeId { get; set; } = string.Empty;

    [JsonPropertyName("employeeName")]
    public string EmployeeName { get; set; } = string.Empty;

    [JsonPropertyName("company")]
    public string Company { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;

    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;

    [JsonPropertyName("time")]
    public string Time { get; set; } = string.Empty;

    [JsonPropertyName("location")]
    public LocationPayload? Location { get; set; }

    [JsonPropertyName("late")]
    public bool Late { get; set; }
}

public class LocationPayload
{
    [JsonPropertyName("latitude")]
    public double Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; set; }
}

public class DashboardStatsEvent
{
    [JsonPropertyName("checkedIn")]
    public int CheckedIn { get; set; }

    [JsonPropertyName("onBreak")]
    public int OnBreak { get; set; }

    [JsonPropertyName("activeEmployees")]
    public int ActiveEmployees { get; set; }

    [JsonPropertyName("lateEmployees")]
    public int LateEmployees { get; set; }

    [JsonPropertyName("avgHours")]
    public string? AvgHours { get; set; }
}

public class EmployeeStatusEvent
{
    [JsonPropertyName("employeeId")]
    public string EmployeeId { get; set; } = string.Empty;

    [JsonPropertyName("employeeName")]
    public string EmployeeName { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("timestamp")]
    public string Timestamp { get; set; } = string.Empty;
}
