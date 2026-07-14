namespace Nexo.Desktop.Models.Domain;

public class DashboardCard
{
    public string Title { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string CardColor { get; set; } = "#FFFFFF";
    public string TextColor { get; set; } = "#000000";
}
