namespace Nexo.Desktop.Services;

public interface INavigationService
{
    Task NavigateToAsync(string route);
    Task PushAsync(string route);
    Task PushAsync(string route, Dictionary<string, object> parameters);
    Task GoBackAsync();
    Task NavigateToLoginAsync();
    Task NavigateToDashboardAsync();
}
