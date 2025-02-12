namespace FarmProject.auth
{
    public class AuthenticationJwtOptions
    {
        public static readonly string ISSUER = "farm-test-issuer-jwt";
        public static readonly string AUDIENCE = "farm-test-audience-jwt";
        public static readonly DateTime EXPIRES = DateTime.UtcNow.Add(TimeSpan.FromMinutes(2));
        public string Key { get; set; }
    }
}
