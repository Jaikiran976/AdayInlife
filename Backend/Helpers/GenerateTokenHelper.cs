namespace Backend.Helpers
{
    internal static class GenerateTokenHelper
    {
        internal static string GenerateToken()
        {
            return Guid.NewGuid().ToString();
        }
    }
}
