using System.Globalization;

namespace Nexo.Desktop.Converters;

public class RoleToIconConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        return value?.ToString()?.ToLower() switch
        {
            "employee" => "👤",
            "editor" => "✏️",
            "manager" => "🛡️",
            "superuser" => "⭐",
            "viewer" => "👁️",
            _ => "👤"
        };
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}
