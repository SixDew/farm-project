namespace FarmProject.auth
{
    public class AuthenticationJwtOptions
    {
        public static readonly string ISSUER = "farm-test-issuer-jwt";
        public static readonly string AUDIENCE = "farm-test-audience-jwt";
        public static DateTime EXPIRES
        {
            get
            {
                return DateTime.UtcNow.AddMinutes(90);
            }
        }
        public string Key { get; set; }
    }
}
