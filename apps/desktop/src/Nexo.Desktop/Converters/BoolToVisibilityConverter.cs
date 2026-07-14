using System.Globalization;

namespace Nexo.Desktop.Converters;

public class BoolToVisibilityConverter : IValueConverter
{
    public bool IsInverted { get; set; }

    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        var b = value is bool boolVal && boolVal;
        if (IsInverted) b = !b;
        return b;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}
