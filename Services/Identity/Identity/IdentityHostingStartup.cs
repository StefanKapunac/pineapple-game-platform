using Identity.Models;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;

[assembly: HostingStartup(typeof(Identity.IdentityHostingStartup))]
namespace Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) => {
                services.AddDbContext<IdentityContext>(options =>
                    options.UseSqlServer(
                        context.Configuration.GetConnectionString("WebAppContextConnection")));

                services.AddDefaultIdentity<Models.IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
                    .AddUserManager<UserManager<Models.IdentityUser>>()
                    .AddSignInManager<SignInManager<Models.IdentityUser>>()
                    .AddEntityFrameworkStores<IdentityContext>();
            });
        }
    }
}
