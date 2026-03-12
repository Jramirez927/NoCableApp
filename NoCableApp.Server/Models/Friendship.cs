namespace NoCableApp.Server.Models;

public enum FriendshipStatus { Pending, Accepted, Declined }

public class Friendship
{
    public int Id { get; set; }
    public string RequesterId { get; set; } = string.Empty;
    public string AddresseeId { get; set; } = string.Empty;
    public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public NoCableUser Requester { get; set; } = null!;
    public NoCableUser Addressee { get; set; } = null!;
}
