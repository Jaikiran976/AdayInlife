using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class SignIn
    {
        [Required]
        public string? usernameOrEmail { get; set;}
        [Required]
        public string? Password { get; set; }
    }
}
