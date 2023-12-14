using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

    }
}