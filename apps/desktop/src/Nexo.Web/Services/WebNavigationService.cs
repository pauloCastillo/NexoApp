using Microsoft.AspNetCore.Components;
using Nexo.Desktop.Services;

namespace Nexo.Web.Services;

public class WebNavigationService : INavigationService
{
    private readonly NavigationManager _nav;

    public WebNavigationService(NavigationManager nav)
    {
        _nav = nav;
    }

    public Task NavigateToAsync(string route)
    {
        _nav.NavigateTo(route);
        return Task.CompletedTask;
    }

    public Task PushAsync(string route)
    {
        _nav.NavigateTo(route);
        return Task.CompletedTask;
    }

    public Task PushAsync(string route, Dictionary<string, object> parameters)
    {
        var query = string.Join("&", parameters.Select(kv =>
            $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value?.ToString() ?? "")}"));
        _nav.NavigateTo($"{route}?{query}");
        return Task.CompletedTask;
    }

    public Task GoBackAsync()
    {
        _nav.NavigateTo("..");
        return Task.CompletedTask;
    }

    public Task NavigateToLoginAsync()
    {
        _nav.NavigateTo("/login");
        return Task.CompletedTask;
    }

    public Task NavigateToDashboardAsync()
    {
        _nav.NavigateTo("/");
        return Task.CompletedTask;
    }
}
