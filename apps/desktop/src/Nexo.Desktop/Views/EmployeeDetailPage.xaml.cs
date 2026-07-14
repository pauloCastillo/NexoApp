using Nexo.Desktop.ViewModels;

namespace Nexo.Desktop.Views;

public partial class EmployeeDetailPage : ContentPage
{
    public EmployeeDetailPage(EmployeeDetailViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
