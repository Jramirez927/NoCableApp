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
public class JournalEntriesController : ControllerBase
{
    private readonly NoCableDbContext _db;
    private readonly UserManager<NoCableUser> _userManager;

    public JournalEntriesController(NoCableDbContext db, UserManager<NoCableUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    // GET api/journalentries
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = _userManager.GetUserId(User);

        var entries = await _db.JournalEntries
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.DateVisited)
            .Select(e => new
            {
                e.Id,
                e.Title,
                e.Body,
                e.PlaceName,
                e.Latitude,
                e.Longitude,
                e.DateVisited,
                e.CreatedAt
            })
            .ToListAsync();

        return Ok(entries);
    }

    // POST api/journalentries
    [HttpPost]
    public async Task<IActionResult> Create(CreateJournalEntryRequest request)
    {
        var userId = _userManager.GetUserId(User);

        var entry = new JournalEntry
        {
            Title = request.Title,
            Body = request.Body,
            PlaceName = request.PlaceName,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            DateVisited = request.DateVisited,
            UserId = userId!
        };

        _db.JournalEntries.Add(entry);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = entry.Id }, new
        {
            entry.Id,
            entry.Title,
            entry.Body,
            entry.PlaceName,
            entry.Latitude,
            entry.Longitude,
            entry.DateVisited,
            entry.CreatedAt
        });
    }
}
