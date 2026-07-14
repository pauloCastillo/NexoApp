using System.Globalization;

namespace Nexo.Desktop.Converters;

public class DateTimeFormatConverter : IValueConverter
{
    public string Format { get; set; } = "HH:mm";

    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is DateTime dt)
        {
            var local = dt.Kind == DateTimeKind.Utc ? dt.ToLocalTime() : dt;
            return local.ToString(Format);
        }
        return value?.ToString();
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

public class TimeOnlyConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is string timeStr && !string.IsNullOrEmpty(timeStr))
            return timeStr;
        return "-";
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}
