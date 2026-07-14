namespace Nexo.Desktop.Helpers;

public static class RoleHelper
{
    public static bool CanView(int userLevel, int requiredLevel) => userLevel >= requiredLevel;
    public static bool CanWrite(int userLevel, int requiredLevel) => userLevel >= requiredLevel;

    public static int GetRoleLevel(string role) => role switch
    {
        "viewer" => 10,
        "employee" => 10,
        "editor" => 20,
        "manager" => 30,
        "superuser" => 99,
        _ => 0
    };
}
