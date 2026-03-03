namespace NoCableApp.Server.Models;

public class CreateJournalEntryRequest
{
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string PlaceName { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public DateTime DateVisited { get; set; }
}
