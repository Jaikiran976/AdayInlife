using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Helpers
{
    internal static class JwtTokenHelper
    {
        // This secret key should be stored securely in appsettings or environment variables!

        private static string SecretKey = string.Empty;

        public static void SetSecretKey(string key)
        {
            SecretKey = key;
        }

        internal static string GenerateToken(string username)
        {
            if (string.IsNullOrEmpty(SecretKey))
                throw new InvalidOperationException("SecretKey not set. Call SetSecretKey first.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(SecretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.Name, username)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        internal static string? GetUsername(string token)
        {
            if (string.IsNullOrEmpty(SecretKey))
                throw new InvalidOperationException("SecretKey not set. Call SetSecretKey first.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(SecretKey);

            try
            {
                // Remove Bearer prefix if present
                token = token.Replace("Bearer ", "").Trim();

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var usernameClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "unique_name");

                if (usernameClaim == null)
                {
                    return null;
                }

                return usernameClaim.Value;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return null;
            }
        }
    }
}
