using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Identity.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Identity.Services;
using Swashbuckle.Swagger.Annotations;
using System.Net;

namespace Identity.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class IdentityController : Controller
    {
        private readonly ILogger<IdentityController> _logger;
        private readonly SignInManager<Models.IdentityUser> _signInManager;
        private readonly UserManager<Models.IdentityUser> _userManager;
        private IUserService _userService;

        public IdentityController(ILogger<IdentityController> logger,
                              SignInManager<Models.IdentityUser> signInManager,
                              UserManager<Models.IdentityUser> userManager,
                              IUserService userService)
        {
            _logger = logger;
            _signInManager = signInManager;
            _userManager = userManager;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        [SwaggerOperation("register")]
        [SwaggerResponse((int)HttpStatusCode.OK)]
        [SwaggerResponse((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> Register([FromBody] IdentityUserDTO iu)
        {
            var user = new Models.IdentityUser { UserName = iu.Username, Email = iu.Email, EmailConfirmed = true };
            var result = await _userManager.CreateAsync(user, iu.Password);

            if (ModelState.IsValid)
            {
                if (result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");
                    var saved_user = _userService.Create(user);
                    await _signInManager.SignInAsync(saved_user, isPersistent: false);

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
    }
}
