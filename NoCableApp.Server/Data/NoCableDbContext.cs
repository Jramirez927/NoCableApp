
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NoCableApp.Server.Models;

namespace NoCableApp.Server.Data
{
    public class NoCableDbContext : IdentityDbContext<NoCableUser>
    {
        public NoCableDbContext(DbContextOptions<NoCableDbContext> options) : base(options)
        {

        }
    }
}
