using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Dtos
{
    public class ChangePasswordDto
    {
        public string? usernameOrEmail { get; set; }

        public string? securityQuestion { get; set; }

        public string? securityAnswer { get; set; }

        public string? newPassword { get; set; }
    }
}
