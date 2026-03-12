using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NoCableApp.Server.Models;

namespace NoCableApp.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<NoCableUser> _userManager;

    public UsersController(UserManager<NoCableUser> userManager)
    {
        _userManager = userManager;
    }

    // GET api/users/search?q=username
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        var userId = _userManager.GetUserId(User);

        if (string.IsNullOrWhiteSpace(q))
            return Ok(Array.Empty<object>());

        var results = await _userManager.Users
            .Where(u => u.Id != userId && u.UserName!.Contains(q))
            .Select(u => new { u.Id, u.UserName })
            .Take(10)
            .ToListAsync();

        return Ok(results);
    }
}
