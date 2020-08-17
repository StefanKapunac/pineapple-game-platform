using Identity.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Services
{
    public interface IUserService
    {
        IdentityUser Authenticate(string username, string password);
        IEnumerable<IdentityUser> GetAll();
        IdentityUser GetById(int id);
        IdentityUser Create(IdentityUser user, string password);
        void Update(IdentityUser user, string password = null);
        void Delete(int id);
    }
}
