using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.EntityFrameworkCore;

namespace Backend.Models
{
    [Collection("users")]
    public class SignUp
    {
        //public int Id { get; set; }

        //[Required]
        //public string UserName { get; set; }
        //[Required]
        //public string Email { get; set; }
        //[Required]
        //public string Password { get; set; }
        //[Required]
        //public string securityQuestion { get; set; }
        //[Required]
        //public string securityAnswer { get; set; }

        //for mongo
        [BsonElement("_Id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [Required]
        public string userName { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public string password { get; set; }
        [Required]
        public string securityQuestion { get; set; }
        [Required]
        public string securityAnswer { get; set; }
    }
}
