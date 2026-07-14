namespace Nexo.Desktop.Services;

public class MauiFileService : IFileService
{
    public async Task SaveAndShareAsync(string fileName, string content, string title)
    {
        var path = Path.Combine(FileSystem.CacheDirectory, fileName);
        await File.WriteAllTextAsync(path, content);
        await Share.Default.RequestAsync(new ShareFileRequest { Title = title, File = new ShareFile(path) });
    }

    public async Task SaveAndShareAsync(string fileName, byte[] content, string title)
    {
        var path = Path.Combine(FileSystem.CacheDirectory, fileName);
        await File.WriteAllBytesAsync(path, content);
        await Share.Default.RequestAsync(new ShareFileRequest { Title = title, File = new ShareFile(path) });
    }
}
