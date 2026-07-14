using System.Globalization;

namespace Nexo.Desktop.Converters;

public class StatusToColorConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        var status = value?.ToString()?.ToLower();
        return status switch
        {
            "entrada" or "aprobado" or "completado" => Colors.Green,
            "descanso" => Colors.Orange,
            "retorno" => Colors.Blue,
            "salida" or "cancelado" => Colors.Gray,
            "pendiente" => Colors.Gold,
            "en_progreso" => Colors.DodgerBlue,
            "rechazado" => Colors.Red,
            "late" or "tarde" => Colors.Red,
            _ => Colors.Gray
        };
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

public class BoolToColorConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        return value is true ? Colors.Green : Colors.Red;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

public class InverseBoolConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value is bool b ? !b : value;

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value is bool b ? !b : value;
}
