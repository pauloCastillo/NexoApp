using Nexo.Desktop.ViewModels;

namespace Nexo.Desktop.Views;

public partial class ReportsPage : ContentPage
{
    public ReportsPage(ReportViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
