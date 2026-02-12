
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using NoCableApp.Server.Data;
using NoCableApp.Server.Models;

namespace NoCableApp.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //Configuration
            var configuration = builder.Configuration;

            //Add DbContext
            builder.Services.AddDbContext<NoCableDbContext>(options => 
                options.UseSqlite(configuration.GetConnectionString("DefaultConnection"),
                sliteOptions => sliteOptions.MigrationsAssembly("NoCableApp.Data.Migrations")
            ));
            //Add Identity
            builder.Services.AddIdentity<NoCableUser, IdentityRole>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = true;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 3;
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
            })
            .AddEntityFrameworkStores<NoCableDbContext>()
            .AddDefaultTokenProviders();

            // Configure token lifespan for email confirmation (adjust as needed)
            builder.Services.Configure<DataProtectionTokenProviderOptions>(opt =>
                opt.TokenLifespan = TimeSpan.FromDays(3));

            // Register a development email sender. Replace with SMTP/SendGrid in production.
            builder.Services.AddSingleton<IEmailSender, FileEmailSender>();

            builder.Services.AddAuthentication();

            builder.Services.AddAuthorization();

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
