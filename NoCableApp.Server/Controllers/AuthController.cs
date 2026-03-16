using System.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using NoCableApp.Server.Models;

namespace NoCableApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<NoCableUser> _userManager;
    private readonly SignInManager<NoCableUser> _signInManager;
    private readonly IEmailSender _emailSender;

    public AuthController(
        UserManager<NoCableUser> userManager,
        SignInManager<NoCableUser> signInManager,
        IEmailSender emailSender)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _emailSender = emailSender;
    }

    // POST api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var user = new NoCableUser { UserName = request.UserName, Email = request.Email };
        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        var confirmationLink = Url.Action(
            nameof(ConfirmEmail), "Auth",
            new { userId = user.Id, token = HttpUtility.UrlEncode(token) },
            Request.Scheme)!;

        var emailBody = $"""
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #1a1a1a;">Welcome to NoCable!</h2>
              <p>Thanks for signing up. Please confirm your email address to activate your account.</p>
              <p style="margin: 24px 0;">
                <a href="{confirmationLink}"
                   style="background-color: #0d6efd; color: #fff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                  Confirm Email
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">
                If you didn't create an account on <a href="https://no-cable.com">no-cable.com</a>, you can safely ignore this email.
              </p>
            </div>
            """;

        await _emailSender.SendEmailAsync(
            user.Email,
            "Confirm your NoCable account",
            emailBody);

        return Ok(new { message = "Registration successful. Check your email to confirm." });
    }

    // GET api/auth/confirm-email?userId=xxx&token=yyy
    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return BadRequest("Invalid user.");

        var decoded = HttpUtility.UrlDecode(token);
        var result = await _userManager.ConfirmEmailAsync(user, decoded);

        if (!result.Succeeded)
            return BadRequest("Invalid or expired confirmation token.");

        return Ok(new { message = "Email confirmed! You can now log in." });
    }

    // POST api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return Unauthorized(new { message = "Invalid credentials." });

        var result = await _signInManager.PasswordSignInAsync(
            user,
            request.Password,
            isPersistent: false,
            lockoutOnFailure: true);

        if (result.IsLockedOut)
            return Unauthorized(new { message = "Account locked. Try again in 5 minutes." });

        if (result.IsNotAllowed)
            return Unauthorized(new { message = "You must confirm your email before logging in." });

        if (!result.Succeeded)
            return Unauthorized(new { message = "Invalid credentials." });

        return Ok(new { message = "Logged in." });
    }

    // POST api/auth/logout
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok(new { message = "Logged out." });
    }

    // PUT api/auth/username
    [Authorize]
    [HttpPut("username")]
    public async Task<IActionResult> ChangeUsername([FromBody] string newUserName)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();
        var result = await _userManager.SetUserNameAsync(user, newUserName);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return Ok(new { message = "Username updated." });
    }

    // GET api/auth/me
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
            return Unauthorized();

        return Ok(new { user.Email, user.UserName });
    }
}
