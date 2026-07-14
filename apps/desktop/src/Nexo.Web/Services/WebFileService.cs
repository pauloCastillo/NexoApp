using Microsoft.JSInterop;
using Nexo.Desktop.Services;

namespace Nexo.Web.Services;

public class WebFileService : IFileService
{
    private readonly IJSRuntime _js;

    public WebFileService(IJSRuntime js)
    {
        _js = js;
    }

    public async Task SaveAndShareAsync(string fileName, string content, string title)
    {
        var bytes = System.Text.Encoding.UTF8.GetBytes(content);
        await SaveAndShareAsync(fileName, bytes, title);
    }

    public async Task SaveAndShareAsync(string fileName, byte[] content, string title)
    {
        using var stream = new MemoryStream(content);
        var base64 = Convert.ToBase64String(content);
        await _js.InvokeVoidAsync("nexoFile.download", fileName, base64);
    }
}
