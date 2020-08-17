using Identity.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Services
{
    public class UserService : IUserService
    {
        private IdentityContext _context;
        public IdentityUser Authenticate(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;

            var user = _context.Users.SingleOrDefault(x => x.UserName == username);

            // check if username exists
            if (user == null)
                return null;

            // check if password is correct
            //if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
               // return null;

            // authentication successful
            return user;
        }

        public IdentityUser Create(IdentityUser user, string password)
        {
            throw new NotImplementedException();
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
