using Microsoft.AspNetCore.Identity.UI.Services;

namespace NoCableApp.Server.Services;

public class FileEmailSender : IEmailSender
{
    private readonly IWebHostEnvironment _env;

    public FileEmailSender(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var dir = Path.Combine(_env.ContentRootPath, "Emails");
        Directory.CreateDirectory(dir);
        var filePath = Path.Combine(dir, $"{DateTime.UtcNow:yyyyMMdd_HHmmss}_{Guid.NewGuid():N}.txt");

        var content = $"To: {email}\nSubject: {subject}\n\n{htmlMessage}\n";
        await File.WriteAllTextAsync(filePath, content);
    }
}
