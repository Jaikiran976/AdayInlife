using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.EntityFrameworkCore;

namespace Backend.Models.Entities
{
    public class SignUp
    {
        //for mongo so change this with bson to int for SQL
        [BsonId]
        public ObjectId Id { get; set; }

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
