using Nexo.Desktop.ViewModels;

namespace Nexo.Desktop.Views;

public partial class PermissionsPage : ContentPage
{
    private readonly PermissionViewModel _viewModel;

    public PermissionsPage(PermissionViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = _viewModel = viewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        _viewModel.LoadCommand.Execute(null);
    }
}
