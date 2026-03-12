using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NoCableApp.Server.Data;
using NoCableApp.Server.Models;

namespace NoCableApp.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class FriendsController : ControllerBase
{
    private readonly NoCableDbContext _db;
    private readonly UserManager<NoCableUser> _userManager;

    public FriendsController(NoCableDbContext db, UserManager<NoCableUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    // GET api/friends
    [HttpGet]
    public async Task<IActionResult> GetFriends()
    {
        var userId = _userManager.GetUserId(User);

        var friends = await _db.Friendships
            .Where(f => f.Status == FriendshipStatus.Accepted &&
                        (f.RequesterId == userId || f.AddresseeId == userId))
            .Select(f => new
            {
                f.Id,
                UserName = f.RequesterId == userId ? f.Addressee.UserName : f.Requester.UserName
            })
            .ToListAsync();

        return Ok(friends);
    }

    // GET api/friends/requests
    [HttpGet("requests")]
    public async Task<IActionResult> GetRequests()
    {
        var userId = _userManager.GetUserId(User);

        var requests = await _db.Friendships
            .Where(f => f.AddresseeId == userId && f.Status == FriendshipStatus.Pending)
            .Select(f => new
            {
                f.Id,
                RequesterUserName = f.Requester.UserName
            })
            .ToListAsync();

        return Ok(requests);
    }

    // POST api/friends/request/{userName}
    [HttpPost("request/{userName}")]
    public async Task<IActionResult> SendRequest(string userName)
    {
        var userId = _userManager.GetUserId(User);
        var addressee = await _userManager.FindByNameAsync(userName);

        if (addressee is null)
            return NotFound("User not found.");

        if (addressee.Id == userId)
            return BadRequest("Cannot send a friend request to yourself.");

        var exists = await _db.Friendships.AnyAsync(f =>
            (f.RequesterId == userId && f.AddresseeId == addressee.Id) ||
            (f.RequesterId == addressee.Id && f.AddresseeId == userId));

        if (exists)
            return Conflict("A friendship or request already exists.");

        _db.Friendships.Add(new Friendship
        {
            RequesterId = userId!,
            AddresseeId = addressee.Id
        });

        await _db.SaveChangesAsync();
        return Ok(new { message = "Friend request sent." });
    }

    // PUT api/friends/{id}/accept
    [HttpPut("{id}/accept")]
    public async Task<IActionResult> Accept(int id)
    {
        var userId = _userManager.GetUserId(User);
        var friendship = await _db.Friendships
            .FirstOrDefaultAsync(f => f.Id == id && f.AddresseeId == userId && f.Status == FriendshipStatus.Pending);

        if (friendship is null)
            return NotFound();

        friendship.Status = FriendshipStatus.Accepted;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Friend request accepted." });
    }

    // PUT api/friends/{id}/decline
    [HttpPut("{id}/decline")]
    public async Task<IActionResult> Decline(int id)
    {
        var userId = _userManager.GetUserId(User);
        var friendship = await _db.Friendships
            .FirstOrDefaultAsync(f => f.Id == id && f.AddresseeId == userId && f.Status == FriendshipStatus.Pending);

        if (friendship is null)
            return NotFound();

        friendship.Status = FriendshipStatus.Declined;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Friend request declined." });
    }

    // DELETE api/friends/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(int id)
    {
        var userId = _userManager.GetUserId(User);
        var friendship = await _db.Friendships
            .FirstOrDefaultAsync(f => f.Id == id &&
                (f.RequesterId == userId || f.AddresseeId == userId) &&
                f.Status == FriendshipStatus.Accepted);

        if (friendship is null)
            return NotFound();

        _db.Friendships.Remove(friendship);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
