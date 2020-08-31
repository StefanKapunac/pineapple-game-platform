using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Identity.Models;
using Microsoft.Extensions.Configuration;

namespace Identity.Data
{
    public class UserContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public UserContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to sql server database
            options.UseSqlServer(Configuration["ConnectionString"]);
            //options.UseSqlServer("Server=mssqldata;Database=IdentityDb;User Id=sa;Password=Pass@word2019");
        }

        public DbSet<Identity.Models.User> Users { get; set; }
    }
}
