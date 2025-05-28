using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Dtos
{
    public class SignInDto
    {
        [Required]
        public string? usernameOrEmail { get; set; }
        [Required]
        public string? Password { get; set; }
    }
}
