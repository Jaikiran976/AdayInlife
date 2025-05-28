using System;

namespace Backend.Helpers
{
    internal static class GenerateTokenHelper
    {
        internal static string GenerateToken(string username)
        {
            Guid guid = Guid.NewGuid();
            string shortGuid = Convert.ToBase64String(guid.ToByteArray())
                .Replace("/", "_")
                .Replace("+", "-") // Make URL-safe
                .Substring(0, 16); // Only take the first 16 characters

            // Step 2: Encrypt the username (AES Encryption)
            string encryptedUsername = AesEncryptionHelper.Encrypt(username);

            // Step 3: Combine the shortened GUID and encrypted username
            shortGuid = shortGuid.Substring(0, 8) + encryptedUsername + shortGuid.Substring(8, 8); // Concatenate parts

            return shortGuid;
        }

        internal static string? GetUsername(string token)
        {
            try
            {
                var encryptedUsername = token.Substring(8, token.Length - 16);
                var username = AesEncryptionHelper.Decrypt(encryptedUsername);
                return username;
            }
            catch
            {
                // Decryption failed or token malformed
                return null;
            }
        }
    }
}
