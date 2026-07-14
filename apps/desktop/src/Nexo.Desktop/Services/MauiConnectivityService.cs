using Microsoft.Maui.Networking;

namespace Nexo.Desktop.Services;

public class MauiConnectivityService : IConnectivityService
{
    public bool IsOnline => Connectivity.Current.NetworkAccess is NetworkAccess.Internet;

    public event Action<bool>? ConnectivityChanged;

    public MauiConnectivityService()
    {
        Connectivity.Current.ConnectivityChanged += (_, e) =>
            ConnectivityChanged?.Invoke(e.NetworkAccess is NetworkAccess.Internet);
    }
}
