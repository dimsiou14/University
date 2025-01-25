using HealthCardApi.Data;
using Microsoft.EntityFrameworkCore;

namespace myApi.Data
{

    public class myApiDbContext : DbContext
    {
        public myApiDbContext(DbContextOptions<myApiDbContext> options)
        : base(options)
        {

        }

        public DbSet<User> UserInfo { get; set; }

        public DbSet<History> HistoryInfo { get; set; }
        public DbSet<OTP> OTPMapping { get; set; }

    }
}