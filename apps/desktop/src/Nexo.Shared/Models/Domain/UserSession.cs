namespace Nexo.Desktop.Models.Domain;

public class UserSession
{
    public string UserId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? CompanyId { get; set; }
    public string UserType { get; set; } = "manager";
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;

    public bool IsSuperuser => Role == "superuser";
    public bool IsManager => Role is "manager" or "superuser";
    public bool CanWrite => Role is "editor" or "manager" or "superuser";
    public bool IsAuthenticated => !string.IsNullOrEmpty(AccessToken);
}
