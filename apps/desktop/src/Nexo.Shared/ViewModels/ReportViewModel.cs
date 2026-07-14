using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Nexo.Desktop.Helpers;
using Nexo.Desktop.Models.Domain;
using Nexo.Desktop.Services;

namespace Nexo.Desktop.ViewModels;

public partial class ReportViewModel : BaseViewModel
{
    private readonly ExportService _export;
    private readonly IFileService _fileService;

    [ObservableProperty]
    private DateTime _fromDate = DateTime.Now.AddDays(-7);

    [ObservableProperty]
    private DateTime _toDate = DateTime.Now;

    [ObservableProperty]
    private string _selectedReportType = "Asistencia";

    [ObservableProperty]
    private string? _exportStatus;

    public List<string> ReportTypes { get; } = ["Asistencia", "Horas Trabajadas", "Ubicaciones", "Órdenes de Trabajo"];

    public ReportViewModel(ApiService api, INavigationService navigation, AuthService authService, IConnectivityService connectivity, ExportService export, IFileService fileService)
        : base(api, navigation, authService, connectivity)
    {
        _export = export;
        _fileService = fileService;
    }

    [RelayCommand]
    private async Task ExportCsvAsync()
    {
        ExportStatus = "Exportando CSV...";
        await ExecuteSafe(async () =>
        {
            var filters = GetFilters();
            var endpoint = SelectedReportType switch
            {
                "Asistencia" => Constants.ApiEndpoints.TimeControls,
                "Horas Trabajadas" => Constants.ApiEndpoints.TimeControls,
                "Ubicaciones" => Constants.ApiEndpoints.Locations,
                "Órdenes de Trabajo" => Constants.ApiEndpoints.WorkOrders,
                _ => Constants.ApiEndpoints.TimeControls
            };

            var csv = await _export.ExportToCsvAsync<object>(endpoint, filters);
            var fileName = $"reporte_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
            await _fileService.SaveAndShareAsync(fileName, csv, "Exportar Reporte");
            ExportStatus = "Exportación completada";
        });
    }

    private Dictionary<string, string> GetFilters()
    {
        return new()
        {
            ["from"] = FromDate.ToString("yyyy-MM-dd"),
            ["to"] = ToDate.ToString("yyyy-MM-dd")
        };
    }
}
