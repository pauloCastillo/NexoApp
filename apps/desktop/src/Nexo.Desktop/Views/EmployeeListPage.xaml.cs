using Nexo.Desktop.ViewModels;

namespace Nexo.Desktop.Views;

public partial class EmployeeListPage : ContentPage
{
    private readonly EmployeeListViewModel _viewModel;

    public EmployeeListPage(EmployeeListViewModel viewModel)
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
