namespace Nexo.Desktop.Helpers;

public static class Constants
{
#if DEBUG
    public static readonly string ApiBaseUrl = "http://localhost:8080";
#else
    public static readonly string ApiBaseUrl = "https://api.nexo.app";
#endif

    public const string AccessTokenKey = "nexo_access_token";
    public const string RefreshTokenKey = "nexo_refresh_token";
    public const string SessionKey = "nexo_session";

    public const string MobileUserAgent = "desktop";

    public const int DefaultPageSize = 50;
    public const int SocketReconnectMaxAttempts = 10;
    public const double SocketReconnectBaseDelayMs = 1000;
    public const double SearchDebounceMs = 300;

    public static class Routes
    {
        public const string Login = "login";
        public const string Dashboard = "dashboard";
        public const string Employees = "employees";
        public const string EmployeeDetail = "employees/detail";
        public const string WorkOrders = "workorders";
        public const string Vacations = "vacations";
        public const string Permissions = "permissions";
        public const string Reports = "reports";
        public const string Settings = "settings";
        public const string Company = "company";
    }

    public static class SocketEvents
    {
        public const string Subscribe = "dashboard:subscribe";
        public const string Unsubscribe = "dashboard:unsubscribe";
        public const string TimeControlCreated = "time_control:created";
        public const string TimeControlUpdated = "time_control:updated";
        public const string EmployeeOnline = "employee:online";
        public const string EmployeeOffline = "employee:offline";
        public const string WorkOrderStatus = "work_order:status";
        public const string NotificationNew = "notification:new";
        public const string DashboardStats = "dashboard:stats";
    }

    public static class ApiEndpoints
    {
        public const string AuthLogin = "/auth/login";
        public const string AuthRefresh = "/auth/refresh";
        public const string TimeControlsToday = "/api/time-controls/today";
        public const string TimeControls = "/api/time-controls";
        public const string Employees = "/api/employees";
        public const string Clients = "/api/clients";
        public const string WorkOrders = "/api/work-orders";
        public const string Permissions = "/api/permissions";
        public const string Vacations = "/api/vacations";
        public const string Companies = "/api/companies";
        public const string Locations = "/api/locations";
        public const string AuditLogs = "/api/audit-logs";
        public const string Notifications = "/api/notifications";
    }
}
