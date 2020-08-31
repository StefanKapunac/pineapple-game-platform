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
        public User toEntity(UserDTO userDTO)
        {
            return new User { /*Id = userDTO.Id, */Username = userDTO.Username, Password = CreatePasswordHash(userDTO.Password)};
        }

        private static string CreatePasswordHash(string password)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                var passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(passwordHash);
            }
        }
    }
}
