namespace Nexo.Desktop.Helpers;

public static class DateTimeHelper
{
    public static string ToLocalDisplay(this DateTime utcTime)
    {
        return utcTime.Kind == DateTimeKind.Utc
            ? utcTime.ToLocalTime().ToString("HH:mm")
            : utcTime.ToString("HH:mm");
    }

    public static string ToShortDateDisplay(this DateTime utcTime)
    {
        return utcTime.Kind == DateTimeKind.Utc
            ? utcTime.ToLocalTime().ToString("dd MMM yyyy")
            : utcTime.ToString("dd MMM yyyy");
    }

    public static string ToRelativeTime(this DateTime utcTime)
    {
        var local = utcTime.Kind == DateTimeKind.Utc ? utcTime.ToLocalTime() : utcTime;
        var diff = DateTime.Now - local;

        if (diff.TotalMinutes < 1) return "ahora";
        if (diff.TotalMinutes < 60) return $"hace {(int)diff.TotalMinutes}m";
        if (diff.TotalHours < 24) return $"hace {(int)diff.TotalHours}h";
        return local.ToString("dd/MM");
    }

    public static string FormatTimeSpan(double totalHours)
    {
        var hours = (int)totalHours;
        var minutes = (int)((totalHours - hours) * 60);
        return $"{hours}h{minutes:D2}m";
    }
}
