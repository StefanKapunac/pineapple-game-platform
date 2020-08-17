using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Identity.Data;
using Microsoft.AspNetCore.Identity;
using Identity.Services;
using Microsoft.AspNetCore.Http;
using Swashbuckle.Swagger.Annotations;
using System.Net;

namespace Identity.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly ILogger<UserController> _logger;
        private readonly SignInManager<Data.IdentityUser> _signInManager;
        private readonly UserManager<Data.IdentityUser> _userManager;
        //private IUserService _userService;

        public UserController(ILogger<UserController> logger, 
                              SignInManager<Data.IdentityUser> signInManager, 
                              UserManager<Data.IdentityUser> userManager/*,
                              IUserService userService*/)
        {
            _logger = logger;
            _signInManager = signInManager;
            _userManager = userManager;
            //_userService = userService;
        }

        protected IActionResult Index()
        {
            return View();
        }

        protected IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        protected IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        [SwaggerOperation("register")]
        [SwaggerResponse((int)HttpStatusCode.OK)]
        [SwaggerResponse((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> Register([FromBody] Data.IdentityUser iu)
        {
            var user = new Data.IdentityUser { UserName = iu.UserName, Email = iu.Email };
            var result = await _userManager.CreateAsync(user, iu.PasswordHash);

            if (ModelState.IsValid)
            {
                    if (result.Succeeded)
                    {
                        _logger.LogInformation("User created a new account with password.");
                        await _signInManager.SignInAsync(user, isPersistent: false);

                        return LocalRedirect(Url.Content("~/"));
                    }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            // If we got this far, something failed, redisplay form
            return new EmptyResult();
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            throw new NotImplementedException();
        }

        [HttpPut]
        public async Task<IActionResult> Put()
        {
            throw new NotImplementedException();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete()
        {
            throw new NotImplementedException();
        }

    }
}
