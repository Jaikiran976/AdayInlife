using Amazon.Runtime.Internal;
using Backend.Data;
using Backend.Helpers;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Driver;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        ILogger<AuthController> _logger;

        public AuthController(AppDbContext context,ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        //Signing up the user
        [HttpPost("SignUp")]
        public async Task<IActionResult> SignUp([FromBody] SignUp user)
        {
            //var users = await _context.Users.ToListAsync();
            //var users = await _context.SignUps.Find(_ => true).ToListAsync();
            var users = await _context.SignUps.Find(FilterDefinition<SignUp>.Empty).ToListAsync(); // More explicit and cleaner
            
            //checking if user with same email exists
            var userWithSameEmail = users.FirstOrDefault(i => i.email == user.email);

            if (userWithSameEmail != null)
            {
                user.password = "";
                return Conflict(new { message = "User Email already exists.", user = user });
            }

            //checking if user with same user name exists
            var userWithSameName = users.FirstOrDefault(i => i.userName == user.userName);

            if (userWithSameName != null)
            {
                user.password = "";
                return Conflict(new { message = "Username already exists.", user = user });
            }

            user.password = AesEncryptionHelper.Encrypt(user.password);
            await _context.SignUps.InsertOneAsync(user);
            //_context.Users.Add(user);
            //_context.ChangeTracker.DetectChanges();
            //_context.SaveChanges();

            user.password = "";
            // new user is created
            return Ok(new
            {
                message = "New user is created.",
                user = user
            });
        }

        //Signing in the user
        [HttpPost("SignIn")]
        public async Task<IActionResult> SignIn([FromBody] SignIn user)
        {
            //var users = await _context.Users.ToListAsync();
            var users = await _context.SignUps.Find(_ => true).ToListAsync();
            //check with mail first if the user exists
            var userFound = users.FirstOrDefault(i => i.email == user.usernameOrEmail);

            //if user not found with email then search with username
            if (userFound == null)
            {
                userFound = users.FirstOrDefault(i => i.userName == user.usernameOrEmail);
            }

            // Check if the user exists
            if (userFound != null)
            {
                userFound.password = AesEncryptionHelper.Decrypt(userFound.password);
                if (user.Password == userFound.password)
                {
                    user.Password = "";
                    return Ok(new
                    {
                        message = "User is present.",
                        user = user,
                        token = GenerateTokenHelper.GenerateToken() // Return the generated token
                    });
                }
                else
                {
                    return Unauthorized(new { message = "Invalid credentials." });
                }
            }

            return NotFound(new { message = "User not found.", user = user });
        }

        //Changing the user password
        [HttpGet("GetSecurityQuestion")]
        public async Task<IActionResult> GetSecurityQuestion([FromQuery] string usernameOrEmail)
        {
            _logger.LogInformation("Processing query: {query}", usernameOrEmail);
            //var users = await _context.Users.ToListAsync();
            var users = await _context.SignUps.Find(_ => true).ToListAsync();
            //check with mail first if the user exists
            var userFound = users.FirstOrDefault(i => i.email == usernameOrEmail);

            //if user not found with email then search with username
            if (userFound == null)
            {
                userFound = users.FirstOrDefault(i => i.userName == usernameOrEmail);
            }

            // Check if the user exists
            if (userFound != null)
            {
                return Ok(new
                {
                    message = "User is present.",
                    question = userFound.securityQuestion
                });
            }

            return NotFound(new { message = "User not found."});
        }

        [HttpPost("VerifyAnswer")]
        public async Task<IActionResult> VerifyAnswer([FromBody] ChangePassword user)
        {
            //var users = await _context.Users.ToListAsync();
            var users = await _context.SignUps.Find(_ => true).ToListAsync();

            //check with mail first if the user exists
            var userFound = users.FirstOrDefault(i => i.email == user.usernameOrEmail);

            //if user not found with email then search with username
            if (userFound == null)
            {
                userFound = users.FirstOrDefault(i => i.userName == user.usernameOrEmail);
            }

            // Check if the user exists
            if (userFound != null)
            {
                if(user.securityAnswer == userFound.securityAnswer)
                {
                    user.securityAnswer = "";
                    return Ok(new
                    {
                        message = "User is present.",
                        user = user
                    });
                }
                else
                {
                    user.securityAnswer = "";
                    return Unauthorized(new {message = "Wrong answer", user = user});
                }
            }

            return NotFound(new { message = "User not found.", user = user });
        }

        [HttpPut("ChangeThePassword")]
        public async Task<IActionResult> ChangeThePassword([FromBody] ChangePassword user)
        {
            //var users = await _context.Users.ToListAsync();
            var users = await _context.SignUps.Find(_ => true).ToListAsync();

            //check with mail first if the user exists
            var userFound = users.FirstOrDefault(i => i.email == user.usernameOrEmail);

            //if user not found with email then search with username
            if (userFound == null)
            {
                userFound = users.FirstOrDefault(i => i.userName == user.usernameOrEmail);
            }

            // Check if the user exists
            if (userFound != null)
            {
                userFound.password = AesEncryptionHelper.Encrypt(user.newPassword);

                await _context.SignUps.ReplaceOneAsync(
                    s => s.Id == userFound.Id,
                    userFound
                );
                //_context.SaveChanges();

                user.newPassword = "";
                user.securityAnswer = "";

                return Ok(new
                {
                    message = "User is present.",
                    user = user
                });
            }

            return NotFound(new { message = "User not found.", user = user });
        }
    }
}
