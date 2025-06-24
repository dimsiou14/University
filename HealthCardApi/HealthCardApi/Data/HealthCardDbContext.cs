using HealthCardApi.Data;
using Microsoft.EntityFrameworkCore;

namespace myApi.Data
{

    public class HealthCardDbContext : DbContext
    {
        public HealthCardDbContext(DbContextOptions<HealthCardDbContext> options)
        : base(options)
        {

        }

        public DbSet<User> UserInfo { get; set; }
        public DbSet<History> HistoryInfo { get; set; }
        public DbSet<OTP> OTPMapping { get; set; }

    }
}