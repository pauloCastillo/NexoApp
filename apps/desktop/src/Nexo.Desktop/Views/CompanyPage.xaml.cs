using Nexo.Desktop.ViewModels;

namespace Nexo.Desktop.Views;

public partial class CompanyPage : ContentPage
{
    private readonly CompanyViewModel _viewModel;

    public CompanyPage(CompanyViewModel viewModel)
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
