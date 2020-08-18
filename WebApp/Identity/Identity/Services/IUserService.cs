using Identity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Services
{
    public interface IUserService
    {
        IEnumerable<IdentityUser> GetAll();
        IdentityUser GetById(int id);
        IdentityUser Create(IdentityUser user);
        void Update(IdentityUser user, string password = null);
        void Delete(int id);
    }
}
