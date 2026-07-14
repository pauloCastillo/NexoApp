using Nexo.Desktop.ViewModels;

namespace Nexo.Desktop.Views;

public partial class WorkOrdersPage : ContentPage
{
    private readonly WorkOrderViewModel _viewModel;

    public WorkOrdersPage(WorkOrderViewModel viewModel)
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
