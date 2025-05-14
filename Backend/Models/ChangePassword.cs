using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class ChangePassword
    {
        public string? usernameOrEmail { get; set; }

        public string? securityQuestion { get; set; }

        public string? securityAnswer { get; set; }

        public string? newPassword { get; set; }
    }
}
