namespace Nexo.Desktop.Models.Enums;

[Flags]
public enum ModulePermission
{
    None = 0,
    Read = 1,
    Write = 2,
    Admin = 4
}
