namespace Nexo.Desktop.Models.Domain;

public class ReportFilter
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public string? EmployeeId { get; set; }
    public string? Department { get; set; }
    public string? Status { get; set; }

    public Dictionary<string, string> ToQueryParams()
    {
        var p = new Dictionary<string, string>();
        if (From.HasValue) p["from"] = From.Value.ToString("yyyy-MM-dd");
        if (To.HasValue) p["to"] = To.Value.ToString("yyyy-MM-dd");
        if (!string.IsNullOrEmpty(EmployeeId)) p["employee"] = EmployeeId;
        if (!string.IsNullOrEmpty(Department)) p["department"] = Department;
        if (!string.IsNullOrEmpty(Status)) p["status"] = Status;
        return p;
    }
}
