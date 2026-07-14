using System.Text;
using System.Text.Json;
using Nexo.Desktop.Helpers;

namespace Nexo.Desktop.Services;

public class ExportService
{
    private readonly ApiService _api;

    public ExportService(ApiService api) => _api = api;

    public async Task<string> ExportToCsvAsync<T>(string endpoint, Dictionary<string, string>? filters = null)
    {
        var data = await _api.GetAsync<List<T>>(endpoint, filters);
        var csv = new StringBuilder();

        var props = typeof(T).GetProperties();
        csv.AppendLine(string.Join(",", props.Select(p => p.Name)));
        foreach (var item in data)
        {
            csv.AppendLine(string.Join(",",
                props.Select(p => FormatCsvValue(p.GetValue(item)?.ToString()))));
        }

        return csv.ToString();
    }

    public async Task<string> ExportToJsonAsync<T>(string endpoint, Dictionary<string, string>? filters = null)
    {
        var data = await _api.GetAsync<List<T>>(endpoint, filters);
        return JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
    }

    public async Task<byte[]> ExportToExcelAsync<T>(string endpoint, Dictionary<string, string>? filters = null)
    {
        var data = await _api.GetAsync<List<T>>(endpoint, filters);
        using var workbook = new ClosedXML.Excel.XLWorkbook();
        var ws = workbook.Worksheets.Add("Reporte");

        var props = typeof(T).GetProperties();
        for (int c = 0; c < props.Length; c++)
            ws.Cell(1, c + 1).Value = props[c].Name;

        for (int r = 0; r < data.Count; r++)
            for (int c = 0; c < props.Length; c++)
                ws.Cell(r + 2, c + 1).Value = props[c].GetValue(data[r])?.ToString() ?? "";

        using var ms = new MemoryStream();
        workbook.SaveAs(ms);
        return ms.ToArray();
    }

    private static string FormatCsvValue(string? val)
    {
        if (val == null) return "";
        return val.Contains(',') || val.Contains('"')
            ? $"\"{val.Replace("\"", "\"\"")}\""
            : val;
    }
}
