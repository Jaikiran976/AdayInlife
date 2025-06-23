using Backend.Data;
using Backend.Helpers;
using Backend.Models.Dtos;
using Backend.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;

            var users = _context.users.ToList();

            foreach (var user in users)
            {
                if (user.password != null)
                {
                    user.password = AesEncryptionHelper.Encrypt(AesEncryptionHelper.Decrypt(user.password));
                }

                if (user.securityAnswer != null)
                {
                    user.securityAnswer = AesEncryptionHelper.Encrypt(user.securityAnswer);
                }
            }

            _context.SaveChanges();
        }

        //get user if already logged in 
        [Authorize]
        [HttpGet("GetUsername")]
        public IActionResult GetUsername()
        {
            var username = User?.Identity?.Name;
            return Ok(new { username });
        }

        //Signing up the user
        [HttpPost("SignUp")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDto user)
        {
            var users = await _context.users.ToListAsync();

            //checking if user with same email exists
            var userWithSameEmail = users.FirstOrDefault(i => i.email == user.email);

            if (userWithSameEmail != null)
            {
                user.password = "";
                return Conflict(new { message = "User Email already exists.", user = user });
            }

            //checking if user with same username exists
            var userWithSameName = users.FirstOrDefault(i => i.userName == user.userName);

            if (userWithSameName != null)
            {
                user.password = "";
                return Conflict(new { message = "Username already exists.", user = user });
            }

            if(user.password !=null) 
                user.password = AesEncryptionHelper.Encrypt(user.password);

            if(user.securityAnswer != null) 
                user.securityAnswer = AesEncryptionHelper.Encrypt(user.securityAnswer);

            SignUp addUser = new SignUp();

            addUser.userName = user.userName;
            addUser.email = user.email;
            addUser.password = user.password;
            addUser.securityQuestion = user.securityQuestion;
            addUser.securityAnswer = user.securityAnswer;

            _context.users.Add(addUser);
            _context.SaveChanges();

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
        public async Task<IActionResult> SignIn([FromBody] SignInDto user)
        {
            var users = await _context.users.ToListAsync();

            //check with mail first if the user exists
            var userFound = users.FirstOrDefault(i => i.email == user.usernameOrEmail);

            //if user not found with email then search with username
            if (userFound == null)
            {
                userFound = users.FirstOrDefault(i => i.userName == user.usernameOrEmail);
            }

            // Check if the user exists
            if (userFound != null && userFound.password != null && userFound.userName != null)
            {
                userFound.password = AesEncryptionHelper.Decrypt(userFound.password);
                if (user.Password == userFound.password)
                {
                    user.Password = "";
                    return Ok(new
                    {
                        message = "User is present.",
                        user = user,
                        token = JwtTokenHelper.GenerateToken(userFound.userName) // Return the generated token
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
            var users = await _context.users.ToListAsync();

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
        public async Task<IActionResult> VerifyAnswer([FromBody] ChangePasswordDto user)
        {
            var users = await _context.users.ToListAsync();

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
                if(user.securityAnswer != null) 
                    user.securityAnswer = AesEncryptionHelper.Encrypt(user.securityAnswer);

                if (user.securityAnswer == userFound.securityAnswer)
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
        public async Task<IActionResult> ChangeThePassword([FromBody] ChangePasswordDto user)
        {
            var users = await _context.users.ToListAsync();

            //check with mail first if the user exists
            var userFound = users.FirstOrDefault(i => i.email == user.usernameOrEmail);

            //if user not found with email then search with username
            if (userFound == null)
            {
                userFound = users.FirstOrDefault(i => i.userName == user.usernameOrEmail);
            }

            // Check if the user exists
            if (userFound != null && user.newPassword != null)
            {
                userFound.password = AesEncryptionHelper.Encrypt(user.newPassword);
                _context.SaveChanges();

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
