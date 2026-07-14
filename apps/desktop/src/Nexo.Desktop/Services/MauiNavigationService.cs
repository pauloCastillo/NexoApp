namespace Nexo.Desktop.Services;

public class MauiNavigationService : INavigationService
{
    public async Task NavigateToAsync(string route) =>
        await Shell.Current.GoToAsync(route);

    public async Task PushAsync(string route) =>
        await Shell.Current.GoToAsync(route);

    public async Task PushAsync(string route, Dictionary<string, object> parameters) =>
        await Shell.Current.GoToAsync(route, parameters);

    public async Task GoBackAsync() =>
        await Shell.Current.GoToAsync("..");

    public async Task NavigateToLoginAsync() =>
        await Shell.Current.GoToAsync("//login");

    public async Task NavigateToDashboardAsync() =>
        await Shell.Current.GoToAsync("//dashboard");
}
