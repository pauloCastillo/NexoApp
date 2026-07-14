namespace Nexo.Desktop.Services;

public interface IFileService
{
    Task SaveAndShareAsync(string fileName, string content, string title);
    Task SaveAndShareAsync(string fileName, byte[] content, string title);
}
