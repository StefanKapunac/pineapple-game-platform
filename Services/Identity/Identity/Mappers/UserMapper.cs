using Identity.Models;
using Identity.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Mappers
{
    public class UserMapper : IMapper<User, UserDTO>
    { 
        public User ToEntity(UserDTO userDTO)
        {
            var hashed = CreatePasswordHash(userDTO.Password);
            return new User { /*Id = userDTO.Id, */Username = userDTO.Username, Password = hashed.Item1, PasswordKey = hashed.Item2};
        }

        private static Tuple<string, string> CreatePasswordHash(string password)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                var passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                var passwordKey = hmac.Key;
               return new Tuple<string, string>(Convert.ToBase64String(passwordHash), Convert.ToBase64String(passwordKey));
            }
        }
    }
}
