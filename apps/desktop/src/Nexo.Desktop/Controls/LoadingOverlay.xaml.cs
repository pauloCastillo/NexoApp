namespace Nexo.Desktop.Controls;

public partial class LoadingOverlay : ContentView
{
    public static readonly BindableProperty IsLoadingProperty =
        BindableProperty.Create(nameof(IsLoading), typeof(bool), typeof(LoadingOverlay), false,
            propertyChanged: (b, _, n) => ((LoadingOverlay)b).IsVisible = (bool)n);
    public static readonly BindableProperty MessageProperty =
        BindableProperty.Create(nameof(Message), typeof(string), typeof(LoadingOverlay), "Cargando...");

    public bool IsLoading { get => (bool)GetValue(IsLoadingProperty); set => SetValue(IsLoadingProperty, value); }
    public string Message { get => (string)GetValue(MessageProperty); set => SetValue(MessageProperty, value); }

    public LoadingOverlay()
    {
        InitializeComponent();
    }
}
