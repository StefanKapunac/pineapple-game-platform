using Identity.Exceptions;
using Identity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Services
{
    public class UserService : IUserService
    {
        private IdentityContext _context;

        public UserService(IdentityContext context)
        {
            _context = context;
        }
        public IdentityUser Create(IdentityUser user)
        {
            if (_context.Users.Any(x => x.UserName == user.UserName))
                throw new AppException("Username \"" + user.UserName + "\" is already taken");

            _context.Users.Add(user);
            _context.SaveChanges();

            return user;
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<IdentityUser> GetAll()
        {
            throw new NotImplementedException();
        }

        public IdentityUser GetById(int id)
        {
            throw new NotImplementedException();
        }

        public void Update(IdentityUser user, string password = null)
        {
            throw new NotImplementedException();
        }
    }
}
