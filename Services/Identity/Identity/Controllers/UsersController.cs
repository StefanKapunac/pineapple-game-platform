using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Identity.Data;
using Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Identity.Mappers;
using Identity.Models.DTO;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

namespace Identity.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserContext _context;
        private readonly IMapper<User, UserDTO> _mapper;
        private readonly IConfiguration _config;

        public UsersController(UserContext context, IMapper<User, UserDTO> mapper, IConfiguration config)
        {
            _context = context;
            _mapper = mapper;
            _config = config;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUser()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users/register
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> RegisterUser(UserDTO userDTO)
        {
            var user = _mapper.ToEntity(userDTO);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var tokenString = GenerateJWTToken(user);

            //return CreatedAtAction("GetUser", new { id = user.Id }, user);
            return Ok(new
            {
                token = tokenString,
                userDetails = user,
            });
        }

        // POST: api/Users/login
        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult LoginUser([FromBody] UserDTO userDTO)
        {
            IActionResult response = Unauthorized();
            if (UserExists(userDTO.Username))
            {
                var loginUser = _context.Users.FirstOrDefault(e => e.Username == userDTO.Username);
                var storedHash = Convert.FromBase64String(loginUser.Password);
                var storedKey = Convert.FromBase64String(loginUser.PasswordKey);
                if(!VerifyPasswordHash(userDTO.Password, storedHash, storedKey))
                {
                    return null;
                }
                var tokenString = GenerateJWTToken(loginUser);
                response = Ok(new
                {
                    token = tokenString,
                    userDetails = loginUser,
                });
            }

            return response;
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        private bool UserExists(string username)
        {
            return _context.Users.Any(e => e.Username == username);
        }

        private string GenerateJWTToken(User userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userInfo.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedKey)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedKey))
            {
                //var computedHash = hmac.ComputeHash(Convert.FromBase64String(password));
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }
    }
}
