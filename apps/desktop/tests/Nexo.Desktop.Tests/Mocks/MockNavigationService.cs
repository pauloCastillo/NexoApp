namespace Nexo.Desktop.Tests.Mocks;

public class MockNavigationService
{
    public string? LastNavigatedRoute { get; private set; }
    public bool GoBackCalled { get; private set; }

    public Task NavigateToAsync(string route)
    {
        LastNavigatedRoute = route;
        return Task.CompletedTask;
    }

    public Task NavigateToLoginAsync()
    {
        LastNavigatedRoute = "login";
        return Task.CompletedTask;
    }

    public Task NavigateToDashboardAsync()
    {
        LastNavigatedRoute = "dashboard";
        return Task.CompletedTask;
    }

    public Task GoBackAsync()
    {
        GoBackCalled = true;
        return Task.CompletedTask;
    }

    public void Reset()
    {
        LastNavigatedRoute = null;
        GoBackCalled = false;
    }
}
