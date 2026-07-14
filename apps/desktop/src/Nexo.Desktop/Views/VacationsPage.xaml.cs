using Nexo.Desktop.ViewModels;

namespace Nexo.Desktop.Views;

public partial class VacationsPage : ContentPage
{
    private readonly VacationViewModel _viewModel;

    public VacationsPage(VacationViewModel viewModel)
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
