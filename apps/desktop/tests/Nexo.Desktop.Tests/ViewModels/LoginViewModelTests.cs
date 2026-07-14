using FluentAssertions;
using Nexo.Desktop.Tests.Mocks;
using NUnit.Framework;

namespace Nexo.Desktop.Tests.ViewModels;

public class LoginViewModelTests
{
    private readonly MockApiService _api;
    private readonly MockAuthService _auth;
    private readonly MockNavigationService _nav;

    public LoginViewModelTests()
    {
        _api = new MockApiService();
        _auth = new MockAuthService();
        _nav = new MockNavigationService();
    }

    [Test]
    public async Task Login_WithValidCredentials_NavigatesToDashboard()
    {
        _api.SetupResponse("auth/login",
            new { manager = new { id = "1", username = "Test", email = "test@test.com", role = "manager", token = "tok", refreshToken = "rt" } });

        var vm = new LoginViewModelStub(_auth, _nav);
        vm.Email = "admin@nexo.com";
        vm.Password = "password123";

        await vm.ExecuteLoginAsync();

        _auth.LoginCalled.Should().BeTrue();
        _auth.LastLoginEmail.Should().Be("admin@nexo.com");
        _nav.LastNavigatedRoute.Should().Be("dashboard");
    }

    [Test]
    public async Task Login_WithEmptyEmail_ShowsError()
    {
        var vm = new LoginViewModelStub(_auth, _nav);
        vm.Email = "";
        vm.Password = "pass";

        await vm.ExecuteLoginAsync();

        vm.ErrorMessage.Should().NotBeNullOrEmpty();
        _auth.LoginCalled.Should().BeFalse();
    }

    [Test]
    public async Task Login_WithEmptyPassword_ShowsError()
    {
        var vm = new LoginViewModelStub(_auth, _nav);
        vm.Email = "admin@test.com";
        vm.Password = "";

        await vm.ExecuteLoginAsync();

        vm.ErrorMessage.Should().NotBeNullOrEmpty();
        _auth.LoginCalled.Should().BeFalse();
    }
}

// Stub that simulates the LoginViewModel behavior without MAUI dependencies
public class LoginViewModelStub
{
    private readonly MockAuthService _auth;
    private readonly MockNavigationService _nav;

    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
    public bool IsBusy { get; set; }

    public LoginViewModelStub(MockAuthService auth, MockNavigationService nav)
    {
        _auth = auth;
        _nav = nav;
    }

    public async Task ExecuteLoginAsync()
    {
        if (string.IsNullOrWhiteSpace(Email) || string.IsNullOrWhiteSpace(Password))
        {
            ErrorMessage = "Correo y contraseña son requeridos";
            return;
        }

        IsBusy = true;
        try
        {
            await _auth.LoginAsync(Email.Trim(), Password);
            await _nav.NavigateToDashboardAsync();
        }
        catch
        {
            ErrorMessage = "Error de autenticación";
        }
        finally
        {
            IsBusy = false;
        }
    }
}
