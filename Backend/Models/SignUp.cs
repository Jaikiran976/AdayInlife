﻿using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class SignUp
    {
        [Required]
        public string? userName { get; set; }
        [Required]
        public string? email { get; set; }
        [Required]
        public string? password { get; set; }
        [Required]
        public string? securityQuestion { get; set; }
        [Required]
        public string? securityAnswer { get; set; }
    }
}
